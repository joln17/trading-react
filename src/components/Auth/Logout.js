import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Logout extends Component {
    static propTypes = {
        setToken: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.setToken('');
    }

    render() {
        return (
            <Redirect to='/login' />
        );
    }
}

export default Logout;
