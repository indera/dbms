import React, {Component} from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export class LinechartQuery5Part1 extends Component {
    constructor(props) {
        super(props);
        this.state = {Data: {}};
    }

    componentDidMount() {
        axios.get("api/getTransTrendUrbanNonUrban")
            .then(res => {
                console.log(res);
                const records = res.data;
                /*
* {
  "trans_num": 36,
  "urban_rank": 1,
  "month_interval": "1-1993"
}
* */
                let dates = [];
                let transNumUrban = [];
                let transNumNonUrban = [];
                records.forEach(record => {
                    dates.push(record.month_interval);
                    if (record.urban_rank === 1) {
                        transNumUrban.push(record.trans_num);
                    } else {
                        transNumNonUrban.push(record.trans_num);
                    }
                });

                this.setState({
                    Data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Urban area resident client transaction trend',
                                data: transNumUrban,
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
                                label: 'Non-Urban area resident client transaction trend',
                                data: transNumNonUrban,
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


export default LinechartQuery5Part1
