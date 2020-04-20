import { Divider, Spin } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { defaultFetchData } from "./TableStats";
import { sleep } from "../../App";
import moment from "moment";

// https://jsfiddle.net/avdzjkpf/
// https://forum.fusioncharts.com/topic/21184-no-data-to-display/

const prepareCardData = (
  data: { month: string; number_of_cards: number }[]
) => {
  const categories = data.map((ele) => {
    return moment(ele.month).format("YYYY-MM");
  });

  const numCards = data.map((ele) => {
    return ele.number_of_cards;
  });

  return {
    categories,
    numCards,
  };
};

// month, district_id, loan_sum
const prepareLoanData = (
  data: { month: string; district_id: number; loan_sum: number }[]
) => {
  const categories = data.map((ele) => {
    return moment(ele.month).format("YYYY-MM");
  });

  const loanSumListByDistrictIdMap = new Map();

  data.forEach((value) => {
    if (
      undefined === loanSumListByDistrictIdMap.get(value.district_id) ||
      loanSumListByDistrictIdMap.get(value.district_id) === null
    ) {
      loanSumListByDistrictIdMap.set(value.district_id, new Map());
    }
    loanSumListByDistrictIdMap
      .get(value.district_id)
      .set(value.month, value.loan_sum);
  });

  const seriesDataByDistrictId: SeriesOptionsType[] = [];
  loanSumListByDistrictIdMap.forEach((loanSumByDateMap, districtIdkey) => {
    const districtLoanSumTimeSeries: number[] = [];
    categories.forEach((monthVal) => {
      districtLoanSumTimeSeries.push(
        loanSumByDateMap.get(monthVal) === undefined
          ? null
          : loanSumByDateMap.get(monthVal)
      );
    });
    seriesDataByDistrictId.push({
      type: "line",
      name: districtIdkey,
      data: districtLoanSumTimeSeries,
    });
  });

  return {
    categories,
    seriesDataByDistrictId,
  };
};

const Trend6: React.FC = () => {
  const urlLoansByDistrict = "/api/getTotalAmountOfLoansPerDistrict";

  const urlCreditCardsIssuedByMonth =
    "/api/getTotalAmountOfCreditCardsIssuedPerMonth";
  const [dataLoansByDistrict, setDataLoansByDistrict] = useState(
    defaultFetchData
  );
  const [
    dataCreditCardsIssuedByMonth,
    setDataCreditCardsIssuedByMonth,
  ] = useState(defaultFetchData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(urlLoansByDistrict);
        window.console.log("got rows: ", result.data.rows);
        /*{
                  "loan_sum": 96396,
                    "month": "1993-07",
                    "district_id": 30
                }*/
        await sleep(1000);
        setDataLoansByDistrict(result.data);
      } catch (error) {
        window.console.error("error: ", error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [setDataLoansByDistrict]);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(urlCreditCardsIssuedByMonth);
        window.console.log("got rows: ", result.data.rows);
        /*{
                  "loan_sum": 96396,
                    "month": "1993-07",
                    "district_id": 30
                }*/
        await sleep(1000);
        setDataCreditCardsIssuedByMonth(result.data);
      } catch (error) {
        window.console.error("error: ", error);
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [setDataCreditCardsIssuedByMonth]);

  const chartDataLoansByDistrict = prepareLoanData(dataLoansByDistrict.rows);

  const optionsLoansByDistrict: Highcharts.Options = {
    title: {
      text: dataLoansByDistrict.description,
    },
    xAxis: {
      categories: chartDataLoansByDistrict.categories,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        connectNulls: true,
      },
    },
    yAxis: {
      title: {
        text: "Credit card Issue count",
      },
      plotLines: [
        { value: 0, width: 1, color: "#88bb88" },
        { value: 1, width: 1, color: "#aa0000" },
      ],
    },
    series: chartDataLoansByDistrict.seriesDataByDistrictId,
  };

  const chartDataCreditCardsIssuedByMonth = prepareCardData(
    dataCreditCardsIssuedByMonth.rows
  );

  const optionsCreditCardsIssuedByMonth: Highcharts.Options = {
    title: {
      text: dataCreditCardsIssuedByMonth.description,
    },
    xAxis: {
      categories: chartDataCreditCardsIssuedByMonth.categories,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        connectNulls: true,
      },
    },
    yAxis: {
      title: {
        text: "Sum of Loan amount in a district in Kč",
      },
      plotLines: [
        { value: 0, width: 1, color: "#88bb88" },
        { value: 1, width: 1, color: "#aa0000" },
      ],
    },
    series: [
      {
        type: "line",
        name: "Credit Cards Issue count",
        data: chartDataCreditCardsIssuedByMonth.numCards,
      },
    ],
  };

  window.console.log("sql: ", dataLoansByDistrict.sql);
  window.console.log("sql: ", dataCreditCardsIssuedByMonth.sql);
  return (
    <>
      {isLoading && <Spin />}
      {isError && <h2>Something went wrong ...</h2>}

      {!isLoading && dataLoansByDistrict && (
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsLoansByDistrict}
        />
      )}

      {/* <Divider />

      // Disabled since we have this exact data in Vis2
      {!isLoading && dataLoansByDistrict && (
        <HighchartsReact
          highcharts={Highcharts}
          options={optionsCreditCardsIssuedByMonth}
        />
      )} */}
    </>
  );
};

export default Trend6;
