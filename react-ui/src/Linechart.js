import React, {Component} from 'react'
import axios from 'axios';
import {Line} from 'react-chartjs-2';

export class Linecharts extends Component {
    constructor(props) {
        super(props);
        this.state = {Data: {}};
    }

    componentDidMount() {
        axios.get("api/getTransactionDetails")
            .then(res => {
                console.log(res);
                const ipl = res.data;
                let dates = [];
                let transactionAmt = [];
                ipl.forEach(record => {
                    dates.push(record.created_date);
                    transactionAmt.push(record.amount);

                });
                this.setState({
                    Data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Transaction pattern',
                                data: transactionAmt,
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


export default Linecharts
