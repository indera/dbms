import { Spin, Divider } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { defaultFetchData } from "./TableStats";
import { sleep } from "../../App";
import moment from "moment";

type AgeGroup = "g0-30" | "g30-60" | "g60";
// X.AGE_GROUP, X.MONTH, Y.AVG_PAYMENTS, Y.NUM_LOANS
// https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/line-labels/
const prepareData = (
  data: {
    month: string;
    age_group: AgeGroup;
    avg_payments: number;
    num_loans: number;
  }[]
) => {
  const categories = data.map((ele) => {
    return moment(ele.month).format("YYYY-MM");
  });

  const g60LoanPayments = data
    .filter((ele) => {
      return ele.age_group === "g60";
    })
    .map((ele) => {
      return ele.avg_payments;
    });
  const g60LoanCount = data
    .filter((ele) => {
      return ele.age_group === "g60";
    })
    .map((ele) => {
      return ele.num_loans;
    });

  const g30LoanPayments = data
    .filter((ele) => {
      return ele.age_group === "g30-60";
    })
    .map((ele) => {
      return ele.avg_payments;
    });
  const g30LoanCount = data
    .filter((ele) => {
      return ele.age_group === "g30-60";
    })
    .map((ele) => {
      return ele.num_loans;
    });
  const g0LoanPayments = data
    .filter((ele) => {
      return ele.age_group === "g0-30";
    })
    .map((ele) => {
      return ele.avg_payments;
    });
  const g0LoanCount = data
    .filter((ele) => {
      return ele.age_group === "g0-30";
    })
    .map((ele) => {
      return ele.num_loans;
    });

  return {
    categories,
    g60LoanPayments,
    g60LoanCount,
    g30LoanPayments,
    g30LoanCount,
    g0LoanPayments,
    g0LoanCount,
  };
};

const Trend4: React.FC = () => {
  const url = "/api/getLoanAvgCountForAgeGroups";
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

  const optionsAmount: Highcharts.Options = {
    title: { text: "Average loan amounts issued for different age categories" },
    xAxis: { categories: chartData.categories },
    plotOptions: {
      series: { allowPointSelect: true },
      column: { dataLabels: { enabled: true } },
    },
    yAxis: {
      title: { text: "Loan amounts" },
      plotLines: [
        { value: 0, width: 1, color: "#88bb88" },
        { value: 1, width: 1, color: "#aa0000" },
        { value: 2, width: 1, color: "#00bb00" },
      ],
    },
    series: [
      { type: "column", name: ">= 60yo (Kč)", data: chartData.g60LoanPayments },
      {
        type: "column",
        name: "30-60 yo (Kč)",
        data: chartData.g30LoanPayments,
      },
      { type: "column", name: "0-30 yo (Kč)", data: chartData.g30LoanPayments },
    ],
  };

  const legend: Highcharts.LegendOptions = {
    layout: "vertical",
    align: "left",
    verticalAlign: "top",
    x: 100,
    y: 70,
    floating: true,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  };
  const plotOptions: Highcharts.PlotOptions = {
    series: { allowPointSelect: true },
    column: { dataLabels: { enabled: true } },
  };

  const optionsCount: Highcharts.Options = {
    legend,
    plotOptions,

    title: { text: "Number of loans issued for different age categories" },
    xAxis: { categories: chartData.categories },
    yAxis: {
      title: { text: "Loan counts" },
      plotLines: [
        { value: 0, width: 1, color: "#88bb88" },
        { value: 1, width: 1, color: "#aa0000" },
        { value: 2, width: 1, color: "#00bb00" },
      ],
    },
    series: [
      { type: "column", name: ">= 60yo (#)", data: chartData.g60LoanCount },
      { type: "column", name: "30-60 yo (#)", data: chartData.g30LoanCount },
      { type: "column", name: "0-30 yo (#)", data: chartData.g0LoanCount },
    ],
  };

  window.console.log("sql: ", data.sql);
  return (
    <>
      {isLoading && <Spin />}
      {isError && <h2>Something went wrong ...</h2>}
      {!isLoading && data && (
        <HighchartsReact highcharts={Highcharts} options={optionsAmount} />
      )}

      <Divider />

      {!isLoading && data && (
        <HighchartsReact highcharts={Highcharts} options={optionsCount} />
      )}
    </>
  );
};

export default Trend4;
