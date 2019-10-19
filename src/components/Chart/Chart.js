import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

class Chart extends Component {
    static propTypes = {
        data: PropTypes.array
    };

    render() {
        return (
            <LineChart width={730} height={250} data={this.props.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bitcoin" stroke="#8884d8" />
            </LineChart>
        );
    }
}

export default Chart;
