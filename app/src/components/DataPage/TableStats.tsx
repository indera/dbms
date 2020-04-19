import { Spin, Layout } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

import { Table } from "antd";
import { sleep } from "../../App";
const { Content } = Layout;

export interface QueryData {
  sql: string;
  description: string;
  elapsed: string;
  rowCount: number;
  rows: [];
}
export const defaultFetchData: QueryData = {
  sql: "",
  description: "",
  elapsed: "",
  rowCount: 0,
  rows: [],
};

const columns = [
  {
    title: "Table",
    dataIndex: "table",
    key: "table",
    // render: (text) => <span>{text}</span>,
  },
  {
    title: "Number of Rows",
    dataIndex: "rows",
    key: "rows",
  },
];

// interface PageProps {
//   loginAppUser: (user: AppUser) => void;
// }
const prepareTableData = (data: { table_name: string; num_rows: number }[]) => {
  const result = data.map((ele, index) => {
    const row = { key: index, table: ele.table_name, rows: ele.num_rows };
    return row;
  });
  return result;
};

interface PageProps {
  time?: Date;
}

// export const useForceUpdate = () => {
//   const [value, setValue] = useState(0);
//   return () => setValue((value) => ++value);
// };

const TableStats: React.FC<PageProps> = ({ time }) => {
  // const forceUpdate = useForceUpdate();
  const url = "/api/tableStats";
  const [data, setData] = useState(defaultFetchData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // https://www.robinwieruch.de/react-hooks-fetch-data
  // https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
  // an effect hook should return nothing or a clean up function.
  useEffect(
    () => {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
          const result = await axios(url);
          window.console.log("got rows: ", result.data);
          await sleep(2000);
          setData(result.data);
        } catch (error) {
          window.console.error("error: ", error);
          setIsError(true);
        }
        setIsLoading(false);
      };
      fetchData();
    },
    // The second argument can be used to define all the variables (allocated in this array) on which the hook depends.
    // If one of the variables changes, the hook runs again
    // If the array with the variables is empty, the hook doesn't run when updating the component at all, because it doesn't have to watch any variables.
    [time, setData]
  );

  return (
    <>
      {isError && <h2>Something went wrong ...</h2>}
      {isLoading && <Spin />}
      {!isLoading && data && (
        <Table
          pagination={{
            hideOnSinglePage: true,
            pageSize: 20,
          }}
          columns={columns}
          dataSource={prepareTableData(data.rows)}
        />
      )}
      {/* </Content> */}
    </>
  );
};

export default TableStats;
