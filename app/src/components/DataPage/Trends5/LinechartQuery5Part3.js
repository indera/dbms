import React, {Component} from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export class LinechartQuery5Part3 extends Component {
    constructor(props) {
        super(props);
        this.state = {Data: {}};
    }

    componentDidMount() {
        axios.get("api/getCardUsageTrendByType")
            .then(res => {
                console.log(res);
                const records = res.data;
                /*
{
card_type: "classic"
​​​
month_interval: "1-1993"
​​​
trans_num: 11
​​​},
{​​​
card_type: "gold"
​​​
month_interval: "1-1993"
​​​
trans_num: 7
},
{​​​
card_type: "junior"
​​​
month_interval: "1-1993"
​​​
trans_num: 2
​​
}
* */
                let dates = [];
                let transNumClassic = [];
                let transNumGold = [];
                let transNumJunior = [];
                records.forEach(record => {
                    dates.push(record.month_interval);
                    if (record.card_type === 'classic') {
                        transNumClassic.push(record.trans_num);
                        transNumGold.push(null);
                        transNumJunior.push(null);
                    } else {
                        if (record.card_type === 'gold') {
                            transNumClassic.push(null);
                            transNumGold.push(record.trans_num);
                            transNumJunior.push(null);
                        } else {
                            transNumClassic.push(null);
                            transNumGold.push(null);
                            transNumJunior.push(record.trans_num);
                        }

                    }
                });

                this.setState({
                    Data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Classic type card holder transaction trend',
                                data: transNumClassic,
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
                                label: 'Gold type card holder  transaction trend',
                                data: transNumGold,
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
                                label: 'Junior type card holder transaction trend',
                                data: transNumJunior,
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


export default LinechartQuery5Part3
