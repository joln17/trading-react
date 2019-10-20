import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

class SelectMonth extends Component {
    static propTypes = {
        month: PropTypes.number,
        selectMonth: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.selectMonth(Number(e.currentTarget.value));
    }

    render() {
        const months = [
            'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
            'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
        ];
        const options = months.map((month, index) => {
            return <option key={index} value={index + 1}>{month}</option>;
        });

        return (
            <div className="datepicker-month">
                <Form.Control as="select" value={this.props.month} onChange={this.handleChange}>
                    {options}
                </Form.Control>
            </div>
        );
    }
}

export default SelectMonth;
