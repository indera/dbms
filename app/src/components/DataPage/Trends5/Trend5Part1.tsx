import { Spin } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

// https://www.fusioncharts.com/dev/getting-started/react/your-first-chart-using-react
// Step 1:
//  yarn add fusioncharts react-fusioncharts
// Step 2 - Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";
// Step 3 - Include the fusioncharts library
import FusionCharts from "fusioncharts";
// Step 4 - Include the chart type
import Column2D from "fusioncharts/fusioncharts.charts";
// Step 5 - Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

// import { Table } from "antd";
import { defaultFetchData } from "../TableStats";
import { sleep } from "../../../App";
import moment from "moment";

// Step 6 - Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const prepareData = (data: { month: string; num_rows: number }[]) => {
  const result = data.map((ele, index) => {
    return {
      // key: index,
      label: moment(ele.month).format("YYYY-MM"),
      value: ele.num_rows,
    };
  });
  return result;
};

const Trend2: React.FC = () => {
  const url = "/api/getTransTrendUrbanNonUrban/";
  const [data, setData] = useState(defaultFetchData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(
    () => {
      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
          const result = await axios(url);
          window.console.log("got rows: ", result.data.rows);
          await sleep(1000);
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
    [setData]
  );

  const chartData = prepareData(data.rows);

  // Create a JSON object to store the chart configurations
  const chartConfigs = {
    // type: "column2d", // The chart type
    type: "line", // The chart type
    width: "1400", // Width of the chart
    height: "800", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: data.description, // Set the chart caption
        subCaption: "", // Set the chart subcaption
        xAxisName: "Month", // Set the x-axis name
        yAxisName: "Bank Cards Issued", // Set the y-axis name
        numberSuffix: "",
        theme: "fusion", //Set the theme for your chart
      },
      // Chart Data
      data: chartData,
    },
  };

  window.console.log("sql: ", data.sql);
  return (
    <>
      {isError && <h2>Something went wrong ...</h2>}
      {isLoading && <Spin />}
      {!isLoading && data && <ReactFC {...chartConfigs} />}
    </>
  );
};

export default Trend2;
