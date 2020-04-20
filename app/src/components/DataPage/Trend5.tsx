import {Divider, Spin} from "antd";
import React, {useState, useEffect} from "react";

import {defaultFetchData} from "./TableStats";

import LinechartQuery5Part1 from "./Trends5/LinechartQuery5Part1";
import LinechartQuery5Part2 from "./Trends5/LinechartQuery5Part2";
import LinechartQuery5Part3 from "./Trends5/LinechartQuery5Part3";
import LinechartQuery5Part4 from "./Trends5/LinechartQuery5Part4";
import LinechartQuery5Part5 from "./Trends5/LinechartQuery5Part5";


const Trend5: React.FC = () => {
    const [data, setData] = useState(defaultFetchData);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
    }, [setData]);


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
    );
};

export default Trend5;
