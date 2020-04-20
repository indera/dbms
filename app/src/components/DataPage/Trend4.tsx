import { Divider, Spin } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { defaultFetchData } from "./TableStats";
import { sleep } from "../../App";
import moment from "moment";

// "Number of accounts open for disposition types (owner/disponent) and region"
const prepareAccountsData = (
  data: {
    month: string;
    type: string; // (owner/disponent)
    region_name: number;
    num_accounts: number;
  }[]
) => {
  const categories = data.map((ele) => {
    return moment(ele.month).format("YYYY-MM");
  });

  const acctListByRegionMap = new Map();

  data.forEach((value) => {
    if (
      undefined === acctListByRegionMap.get(value.region_name) ||
      acctListByRegionMap.get(value.region_name) === null
    ) {
      acctListByRegionMap.set(value.region_name, new Map());
    }
    acctListByRegionMap
      .get(value.region_name)
      .set(value.month, value.num_accounts);
  });

  const seriesByRegion: SeriesOptionsType[] = [];

  acctListByRegionMap.forEach((accountNumByDateMap, regionName) => {
    const regionAccountNumTimeSeries: number[] = [];

    categories.forEach((monthVal) => {
      regionAccountNumTimeSeries.push(
        accountNumByDateMap.get(monthVal) === undefined
          ? null
          : accountNumByDateMap.get(monthVal)
      );
    });
    seriesByRegion.push({
      type: "line",
      name: regionName,
      data: regionAccountNumTimeSeries,
    });
  });

  return {
    categories,
    seriesByRegion,
  };
};

const Trend4: React.FC = () => {
  const url = "/api/getNumAccountsOpenByDispositionAndRegion";
  // const url = "/api/getNumAccountsOpenByDispositionAndRegionDisponent";

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

  const dataOwnerAccounts = prepareAccountsData(data.rows);
  const dataDisponentAccounts = prepareAccountsData(data.rows);

  const plotOptions = {
    series: {
      allowPointSelect: true,
      connectNulls: true,
    },
  };

  const titleA = "Number of Owner Accounts Created";
  const titleB = "Number of Disponent Accounts Created";

  const optionsOwnerAccountByRegion: Highcharts.Options = {
    title: { text: titleA },
    plotOptions,
    xAxis: { categories: dataOwnerAccounts.categories },
    yAxis: {
      title: { text: "Number of Accounts Open" },
      plotLines: [{ value: 0, width: 1, color: "#88bb88" }],
    },
    series: dataOwnerAccounts.seriesByRegion,
  };
  const optionsDisponentAccountByRegion: Highcharts.Options = {
    title: { text: titleB },
    plotOptions,
    xAxis: { categories: dataDisponentAccounts.categories },
    yAxis: {
      title: { text: "Number of Accounts Open" },
      plotLines: [{ value: 0, width: 1, color: "#88bb88" }],
    },
    series: dataDisponentAccounts.seriesByRegion,
  };

  window.console.log("sql: ", data.sql);
  return (
    <>
      {isLoading && <Spin />}
      {isError && <h2>Something went wrong ...</h2>}

      <Divider />
      {!isLoading && data && (
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsOwnerAccountByRegion}
        />
      )}

      {/* <Divider />
      {!isLoading && data && (
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsDisponentAccountByRegion}
        />
      )} */}
    </>
  );
};

export default Trend4;
