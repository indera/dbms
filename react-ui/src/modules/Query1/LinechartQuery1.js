import React, {Component} from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export class LinechartQuery1 extends Component {
    constructor(props) {
        super(props);
        this.state = {Data: {}};
    }

    componentDidMount() {
        axios.get("api/getSumTransBalanceMonthByGender")
            .then(res => {
                console.log(res);
                const records = res.data;
                let dates = [];
                let sumOfBalanceM = [];
                let sumOfBalanceF = [];
                records.forEach(record => {
                    dates.push(record.month);
                    if (record.gender === 'F') {
                        sumOfBalanceF.push(record.sum_of_balance);
                        sumOfBalanceM.push(null);
                    } else {
                        sumOfBalanceF.push(null);
                        sumOfBalanceM.push(record.sum_of_balance);
                    }
                });


                this.setState({
                    Data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Female Client Account balance pattern',
                                data: sumOfBalanceF,
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
                                label: ' Male Client Account balance pattern',
                                data: sumOfBalanceM,
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


export default LinechartQuery1
