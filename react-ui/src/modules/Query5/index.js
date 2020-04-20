import React from 'react';
import LinechartQuery5Part1 from "./LinechartQuery5Part1";
import LinechartQuery5Part2 from "./LinechartQuery5Part2";
import LinechartQuery5Part3 from "./LinechartQuery5Part3";
import LinechartQuery5Part4 from "./LinechartQuery5Part4";
import LinechartQuery5Part5 from "./LinechartQuery5Part5";

const TransactionDerivation = () => (
    <>
        <div>Transaction based timelines Module</div>
        <LinechartQuery5Part1/>
        <LinechartQuery5Part2/>
        <LinechartQuery5Part3/>
        <LinechartQuery5Part4/>
        <LinechartQuery5Part5/>
    </>
);

export default {
    routeProps: {
        path: '/query5',
        component: TransactionDerivation
    },
    name: 'Transaction based timelines',
}