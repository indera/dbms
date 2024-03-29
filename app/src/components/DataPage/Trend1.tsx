import { Spin } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { defaultFetchData } from "./TableStats";
import { sleep } from "../../App";
import moment from "moment";
import { Gender } from "./DataPage";

// https://jsfiddle.net/avdzjkpf/
// https://forum.fusioncharts.com/topic/21184-no-data-to-display/
// month, gender, sum_balance
// const prepareDataFusionCharts = (
//   data: { month: string; gender: Gender; sum_balance: number }[]
// ) => {
//   const labels = data.map((ele) => {
//     return {
//       label: moment(ele.month).format("YYYY-MM"),
//     };
//   });
//   const femaleData = data
//     .filter((ele) => {
//       return ele.gender === "F";
//     })
//     .map((ele) => {
//       return {
//         value: String(ele.sum_balance),
//       };
//     });
//   const maleData = data
//     .filter((ele) => {
//       return ele.gender === "M";
//     })
//     .map((ele) => {
//       return {
//         value: String(ele.sum_balance),
//       };
//     });

//   return {
//     categories: [{ category: labels }],
//     dataset: [
//       { seriesname: "female", data: femaleData },
//       { seriesname: "male", data: maleData },
//     ],
//   };
// };

// month, gender, sum_balance
const prepareData = (
  data: { month: string; gender: Gender; sum_balance: number }[]
) => {
  const categories = data.map((ele) => {
    return moment(ele.month).format("YYYY-MM");
  });
  const femaleData = data
    .filter((ele) => {
      return ele.gender === "F";
    })
    .map((ele) => {
      return ele.sum_balance;
    });
  const maleData = data
    .filter((ele) => {
      return ele.gender === "M";
    })
    .map((ele) => {
      return ele.sum_balance;
    });

  return {
    categories,
    femaleData,
    maleData,
  };
};

const Trend1: React.FC = () => {
  const url = "/api/getSumTransBalanceMonthByGenderV2";
  const [data, setData] = useState(defaultFetchData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
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
  }, [setData]);

  const chartData = prepareData(data.rows);

  const options: Highcharts.Options = {
    title: {
      text: data.description,
    },
    xAxis: {
      categories: chartData.categories,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
      },
      line: {
        // dataLabels: {
        //   enabled: true,
        // },
      },
    },
    yAxis: {
      title: {
        text: "Transaction Balance in Kč",
      },
      plotLines: [
        { value: 0, width: 1, color: "#88bb88" },
        { value: 1, width: 1, color: "#aa0000" },
      ],
    },
    series: [
      {
        type: "line",
        name: "Female",
        data: chartData.femaleData,
      },
      {
        type: "line",
        name: "Male",
        data: chartData.maleData,
      },
    ],
  };

  window.console.log("sql: ", data.sql);
  return (
    <>
      {isLoading && <Spin />}
      {isError && <h2>Something went wrong ...</h2>}
      {/* {!isLoading && data && <ReactFC {...chartConfigs} />} */}
      {!isLoading && data && (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </>
  );
};

export default Trend1;
