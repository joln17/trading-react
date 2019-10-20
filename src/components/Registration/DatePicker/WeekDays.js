import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectDay from './SelectDay';

class WeekDays extends Component {
    static propTypes = {
        day: PropTypes.number.isRequired,
        highlight: PropTypes.bool,
        year: PropTypes.number.isRequired,
        month: PropTypes.number.isRequired,
        range: PropTypes.arrayOf(PropTypes.number),
        selectDay: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.selectDay = this.selectDay.bind(this);
    }

    selectDay(e) {
        this.props.selectDay(e);
    }

    render() {
        const days = new Date(this.props.year, this.props.month, 0).getDate();
        const firstDay = new Date(this.props.year, this.props.month - 1, 1).getDay() + 6;
        const range = [...Array(days)].map((_, i) => i + 1);
        const weeks = [];
        const weekDays = [];

        for (let i = 0, l = firstDay; i < l; i++) {
            range.unshift(undefined);
        }

        while (range.length > 0) {
            weeks.push(range.splice(0, 7));
        }

        for (let j = 0, len = weeks.length; j < len; j++) {
            if (weeks[j].length < 7) {
                for (let m = weeks[j].length, n = 7; m < n; m++) {
                    weeks[j].push(undefined);
                }
            }
            weekDays.push(
                <SelectDay
                    key={j}
                    highlight={this.props.highlight}
                    days={weeks[j]}
                    selectDay={this.selectDay}
                    day={Number(this.props.day)}
                />
            );
        }

        const weekTitle = ['Må', 'Ti', 'On', 'To', 'Fr', 'Lö', 'Sö'].map(v => {
            return (<th key={v}>{v}</th>);
        });

        return (
            <table className="datepicker-table">
                <thead>
                    <tr>
                        {weekTitle}
                    </tr>
                </thead>
                <tbody>
                    {weekDays}
                </tbody>
            </table>
        );
    }
}

export default WeekDays;
