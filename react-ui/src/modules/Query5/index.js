import React from 'react';
import LinechartQuery5Part1 from "./LinechartQuery5Part1";
import LinechartQuery5Part2 from "./LinechartQuery5Part2";
import LinechartQuery5Part3 from "./LinechartQuery5Part3";
import LinechartQuery5Part4 from "./LinechartQuery5Part4";
import LinechartQuery5Part5 from "./LinechartQuery5Part5";

const TransactionDerivation = () => (
    <>
        <p>
            <div>Transaction based timelines Module</div>
        </p>
        <p>
            <LinechartQuery5Part1/>
        </p>
        <p>
            <LinechartQuery5Part2/>
        </p>
        <p>
            <LinechartQuery5Part3/>
        </p>
        <p>
            <LinechartQuery5Part4/>
        </p>
        <p>
            <LinechartQuery5Part5/>
        </p>
    </>
);

export default {
    routeProps: {
        path: '/query5',
        component: TransactionDerivation
    },
    name: 'Transaction based timelines',
}