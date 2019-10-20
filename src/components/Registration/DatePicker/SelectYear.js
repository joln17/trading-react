import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

class SelectYear extends Component {
    static propTypes = {
        year: PropTypes.number,
        selectYear: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.selectYear(Number(e.currentTarget.value));
    }

    render() {
        const today = new Date();
        const options = Array.from(
            { length: today.getFullYear() - 1899 },
            (_, i) => <option key={1900 + i} value={1900 + i}>{1900 + i}</option>
        );

        return (
            <div className="datepicker-year">
                <Form.Control as="select" value={this.props.year} onChange={this.handleChange}>
                    {options}
                </Form.Control>
            </div>
        );
    }
}

export default SelectYear;
