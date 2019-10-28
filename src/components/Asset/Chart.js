import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    Tooltip, CartesianGrid
} from 'recharts';

class Chart extends Component {
    static propTypes = {
        asset: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired
    };

    render() {
        return (
            <ResponsiveContainer height={250}>
                <AreaChart data={this.props.data}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString('sv-SE')}
                    />
                    <YAxis
                        type="number"
                        domain={['dataMin - 1', 'dataMax + 1']}
                        tickFormatter={value => value.toFixed(2)}
                    />
                    <Tooltip
                        formatter={value => ["$" + value, this.props.asset]}
                        labelFormatter={
                            timestamp => "time: " + new Date(timestamp).toLocaleTimeString('sv-SE')
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    }
}

export default Chart;
