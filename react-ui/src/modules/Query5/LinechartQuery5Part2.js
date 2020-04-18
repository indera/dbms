import React, {Component} from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export class LinechartQuery5Part2 extends Component {
    constructor(props) {
        super(props);
        this.state = {Data: {}};
    }

    componentDidMount() {
        axios.get("api/getTransTrendOfIncomeWiseGroupedDistricts")
            .then(res => {
                console.log(res);
                const records = res.data;
                /*
* {
  "trans_num": 18,
  "income_group_rank": 1,
  "month_interval": "5-1995"
}
* */
                let dates = [];
                let transNumHIG = [];
                let transNumMIG = [];
                let transNumLIG = [];
                records.forEach(record => {
                    dates.push(record.month_interval);
                    if (record.income_group_rank === 1) {
                        transNumHIG.push(record.trans_num);
                    } else {
                        if (record.income_group_rank === 2){
                            transNumMIG.push(record.trans_num);
                        }else{
                            transNumLIG.push(record.trans_num);
                        }

                    }
                });

                this.setState({
                    Data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'High Income Group(HIG) client transaction trend',
                                data: transNumHIG,
                                fill: false,
                                lineTension: 0.1,
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
                                label: 'Medium Income Group(MIG) client transaction trend',
                                data: transNumMIG,
                                fill: false,
                                lineTension: 0.1,
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
                                label: 'Low Income Group (LIG) client transaction trend',
                                data: transNumLIG,
                                fill: false,
                                lineTension: 0.1,
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


export default LinechartQuery5Part2
