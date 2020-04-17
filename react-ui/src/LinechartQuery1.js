import React, {Component} from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';

//TODO: Add seperate lines for gender segregation of data
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
                let sumOfBalance = [];
                records.forEach(record => {
                    dates.push(record.month);
                    sumOfBalance.push(record.sum_of_balance);

                });
                this.setState({
                    Data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Account balance pattern',
                                data: sumOfBalance,
                                backgroundColor: [
                                    "#3cb371",
                                    "#0000FF",
                                    "#9966FF",
                                    "#4C4CFF",
                                    "#00FFFF",
                                    "#f990a7",
                                    "#aad2ed",
                                    "#FF00FF",
                                    "Blue",
                                    "Red"
                                ]
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
