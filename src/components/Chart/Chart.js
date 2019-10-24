import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    Tooltip, CartesianGrid, Legend } from 'recharts';

class Chart extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired
    };

    render() {
        return (
            <ResponsiveContainer height={300}>
                <LineChart data={this.props.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString('sv-SE')}
                    />
                    <YAxis
                        type="number"
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tickFormatter={value => value.toFixed(2)}
                    />
                    <Tooltip
                        formatter={value => "$" + value}
                        labelFormatter={
                            timestamp => new Date(timestamp).toLocaleTimeString('sv-SE')
                        }
                    />
                    <Legend />
                    <Line type="monotone" dataKey="value" dot={false} stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default Chart;
