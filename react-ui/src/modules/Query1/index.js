import React from 'react';
import LinechartQuery1 from "./LinechartQuery1";

const AccountBalanceDerivation = () => (
    <>
        <p>
            <div>Account balance based timelines Module</div>
            <LinechartQuery1/>
        </p>
    </>
);

export default {
    routeProps: {
        path: '/query1',
        component: AccountBalanceDerivation
    },
    name: 'Account balance based timelines',
}
