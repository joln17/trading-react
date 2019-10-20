import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import Calendar from './Calendar';

import './DatePicker.css';

class DatePicker extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string
    };

    static defaultProps = {
        disabled: false,
        value: ''
    }

    constructor(props) {
        super(props);
        this.onClickDatePickerArea = this.onClickDatePickerArea.bind(this);
        this.onClickCalendar = this.onClickCalendar.bind(this);
        this.onClickClose = this.onClickClose.bind(this);
        this.calendar = this.calendar.bind(this);
        this.focusIn = this.focusIn.bind(this);
        this.state = { isCalendarShow: false };
    }

    componentDidMount() {
        document.addEventListener('click', this.documentClickHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.documentClickHandler);
    }

    onClickDatePickerArea(e) {
        e.nativeEvent.stopImmediatePropagation();
    }

    onClickCalendar(date) {
        this.setState({
            isCalendarShow: false
        });
        this.props.onChange(date);
    }

    onClickClose() {
        this.setState({
            isCalendarShow: false
        });
    }

    calendar() {
        return (
            <Calendar
                onClickCalendar={this.onClickCalendar}
                onClickClose={this.onClickClose}
                date={this.props.value}
            />
        );
    }

    focusIn() {
        if (this.props.disabled === true) {
            return;
        }
        this.setState({
            isCalendarShow: true
        });
    }

    render() {
        return (
            <div className="datepicker" onClick={this.onClickDatePickerArea}>
                <Form.Control
                    className={
                        `datepicker-input
                        ${this.props.disabled === true ? 'datepicker-input-disabled' : ''}`
                    }
                    type="text"
                    onFocus={this.focusIn}
                    value={this.props.value}
                    readOnly
                    disabled={this.props.disabled}
                />
                {this.state.isCalendarShow === false ? null : this.calendar()}
            </div>
        );
    }
}

export default DatePicker;
