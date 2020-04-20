import React, {Component} from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export class LinechartQuery5Part4 extends Component {
    constructor(props) {
        super(props);
        this.state = {Data: {}};
    }

    componentDidMount() {
        axios.get("api/getTransactionTrendByAmount")
            .then(res => {
                console.log(res);
                const records = res.data;
                /*
* {
  "trans_num": 24,
  "trans_amount_rank": 1,
  "month_interval": "1-1993"
}
* */
                let dates = [];
                let transNumHighAmount = [];
                let transNumMediumAmount = [];
                let transNumLowAmount = [];
                records.forEach(record => {
                    dates.push(record.month_interval);
                    if (record.trans_amount_rank === 1) {
                        transNumHighAmount.push(record.trans_num);
                        transNumMediumAmount.push(null);
                        transNumLowAmount.push(null);
                    } else {
                        if (record.trans_amount_rank === 2) {
                            transNumHighAmount.push(null);
                            transNumMediumAmount.push(record.trans_num);
                            transNumLowAmount.push(null);
                        } else {
                            transNumHighAmount.push(null);
                            transNumMediumAmount.push(null);
                            transNumLowAmount.push(record.trans_num);
                        }

                    }
                });

                this.setState({
                    Data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Large amount transaction trend',
                                data: transNumHighAmount,
                                fill: false,
                                lineTension: 0.3,
                                backgroundColor: "rgba(225,0,0,0.4)",
                                borderColor: "red", // The main line color
                                borderCapStyle: 'square',
                                borderDash: [], // try [5, 15] for instance
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: "black",
                                pointBackgroundColor: "white",
                                pointBorderWidth: 1,
                                pointHoverRadius: 8,
                                pointHoverBackgroundColor: "yellow",
                                pointHoverBorderColor: "brown",
                                pointHoverBorderWidth: 2,
                                pointRadius: 4,
                                pointHitRadius: 10,
                                spanGaps: true,

                            }, {
                                label: 'Medium amount transaction trend',
                                data: transNumMediumAmount,
                                fill: false,
                                lineTension: 0.3,
                                backgroundColor: "rgba(167,105,0,0.4)",
                                borderColor: "rgb(167, 105, 0)",
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: "white",
                                pointBackgroundColor: "black",
                                pointBorderWidth: 1,
                                pointHoverRadius: 8,
                                pointHoverBackgroundColor: "brown",
                                pointHoverBorderColor: "yellow",
                                pointHoverBorderWidth: 2,
                                pointRadius: 4,
                                pointHitRadius: 10,
                                spanGaps: true,
                            }, {
                                label: 'Low amount transaction trend',
                                data: transNumLowAmount,
                                fill: false,
                                lineTension: 0.3,
                                backgroundColor: "rgba(105,167,0,0.4)",
                                borderColor: "green",
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderColor: "white",
                                pointBackgroundColor: "black",
                                pointBorderWidth: 1,
                                pointHoverRadius: 8,
                                pointHoverBackgroundColor: "brown",
                                pointHoverBorderColor: "yellow",
                                pointHoverBorderWidth: 2,
                                pointRadius: 4,
                                pointHitRadius: 10,
                                spanGaps: true,
                            }
                        ]
                    }
                });
            })
    }

    render() {
        return (
            <div>
                <Line
                    data={this.state.Data}
                    options={{maintainAspectRatio: true}}/>
            </div>
        )
    }
}


export default LinechartQuery5Part4
