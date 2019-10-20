import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectDay extends Component {
    static propTypes = {
        day: PropTypes.number,
        days: PropTypes.array.isRequired,
        highlight: PropTypes.bool,
        selectDay: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.selectDay(e.target.textContent);
    }

    render() {
        let tableData;
        const daysArr = typeof this.props.days === 'undefined' ? [] : this.props.days;
        const days = daysArr.map((day, index) => {
            if (day) {
                tableData =
                    <td key={index}
                        className={
                            day === this.props.day && this.props.highlight ?
                                "datepicker-day-selected datepicker-day" :
                                "datepicker-day"
                        }
                        onClick={this.handleClick}>
                        {day}
                    </td>;
                return tableData;
            } else {
                tableData =
                    <td key={index}
                        className={"datepicker-day-disabled datepicker-day"}>
                    </td>;
                return tableData;
            }
        });

        return (
            <tr>{days}</tr>
        );
    }
}

export default SelectDay;
