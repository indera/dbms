import {Divider, Spin} from "antd";
import axios from "axios";
import React, {useState, useEffect} from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import {defaultFetchData} from "./TableStats";
import {sleep} from "../../App";
import moment from "moment";

import LinechartQuery5Part1 from "./Trends5/LinechartQuery5Part1";
import LinechartQuery5Part2 from "./Trends5/LinechartQuery5Part2";
import LinechartQuery5Part3 from "./Trends5/LinechartQuery5Part3";
import LinechartQuery5Part4 from "./Trends5/LinechartQuery5Part4";
import LinechartQuery5Part5 from "./Trends5/LinechartQuery5Part5";


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

const Trend5: React.FC = () => {
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
                text: "Loan amounts/counts",
            },
            plotLines: [
                {value: 0, width: 1, color: "#88bb88"},
                {value: 1, width: 1, color: "#88bb88"},

                {value: 2, width: 1, color: "#aa0000"},
                {value: 3, width: 1, color: "#aa0000"},

                {value: 4, width: 1, color: "#00bb00"},
                {value: 5, width: 1, color: "#00bb00"},
            ],
        },
        series: [
            {
                type: "line",
                name: ">= 60yo (Kč)",
                data: chartData.g60LoanPayments,
            },
            {
                type: "bar",
                name: ">= 60yo (#)",
                data: chartData.g60LoanCount,
            },
        ],
    };

    return (
        <>
            {isLoading && <Spin />}
            {isError && <h2>Something went wrong ...</h2>}
            {!isLoading && data && (
                <LinechartQuery5Part1/>
            )}
            <Divider />
            {!isLoading && data && (
                <LinechartQuery5Part2/>
            )}
            <Divider />
            {!isLoading && data && (
                <LinechartQuery5Part3/>
            )}
            <Divider />{!isLoading && data && (
            <LinechartQuery5Part4/>
        )}
            <Divider />{!isLoading && data && (
            <LinechartQuery5Part5/>
        )}

        </>


        /*
      <>
        {isLoading && <Spin />}
        {isError && <h2>Something went wrong ...</h2>}
        {!isLoading && data && (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}


      </>
  */
        /*

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
        * */
    );
};

export default Trend5;
