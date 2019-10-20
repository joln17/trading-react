import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';

import SelectYear from './SelectYear';
import SelectMonth from './SelectMonth';
import WeekDays from './WeekDays';

class Calendar extends Component {
    static propTypes = {
        date: PropTypes.string,
        onClickCalendar: PropTypes.func.isRequired,
        onClickClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.formatDate = this.formatDate.bind(this);
        this.selectYear = this.selectYear.bind(this);
        this.selectMonth = this.selectMonth.bind(this);
        this.selectDay = this.selectDay.bind(this);
        this.handleClickClose = this.handleClickClose.bind(this);
        const date = new Date(this.props.date || null);

        this.state = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    formatDate() {
        let month, day, date;

        month = String(this.state.month);
        month = month.length < 2 ? `0${month}` : `${month}`;
        day = String(this.state.day);
        day = day.length < 2 ? `0${day}` : `${day}`;
        date = `${this.state.year}-${month}-${day}`;
        this.props.onClickCalendar(date);
    }

    selectYear(year) {
        this.setState({
            year: year
        });
    }

    selectMonth(month) {
        this.setState({
            month: month
        });
    }

    selectDay(day) {
        this.setState({
            day: day
        }, () => {
            this.formatDate();
        });
    }

    handleClickClose() {
        this.props.onClickClose();
    }

    render() {
        return (
            <div className="datepicker-calendar">
                <div className="datepicker-calendar-header">
                    <Form.Row className="datepicker-top-row">
                        <Col md={4}>
                            <SelectYear
                                year={Number(this.state.year)}
                                selectYear={this.selectYear}
                            />
                        </Col>
                        <Col md={6}>
                            <SelectMonth
                                month={Number(this.state.month)}
                                selectMonth={this.selectMonth}
                            />
                        </Col>
                        <Col>
                            <div className="datepicker-close" onClick={this.handleClickClose}>
                                🗙
                            </div>
                        </Col>
                    </Form.Row>
                </div>
                <WeekDays
                    highlight={
                        new Date(this.props.date).getFullYear() === this.state.year &&
                        new Date(this.props.date).getMonth() + 1 === this.state.month
                    }
                    year={Number(this.state.year)}
                    month={Number(this.state.month)}
                    day={Number(this.state.day)}
                    selectDay={this.selectDay}
                />
            </div>
        );
    }
}

export default Calendar;
