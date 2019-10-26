import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import config from '../../config';

import HoldingsTable from './HoldingsTable';

class Holdings extends Component {
    static propTypes = {
        connected: PropTypes.bool.isRequired,
        getCurrentData: PropTypes.func.isRequired,
        currentData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            holdings: null,
            redirect: ''
        };
    }

    componentDidMount() {
        if (this.props.connected) {
            this.props.getCurrentData();
        }

        const urlHoldings = config.baseURL + '/account/holdings';

        fetch(urlHoldings, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        }).then(response => {
            return response.json();
        }).then(result => {
            if (result.data) {
                this.setState({ holdings: result.data });
            } else if (result.error) {
                if (result.error.message === "Failed authentication") {
                    localStorage.removeItem('token');
                    this.setState({ redirect: '/login' });
                } else {
                    console.log(result.error);
                }
            }
        }).catch(error => {
            console.log("Request failed due to the following error: ", error.message);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.connected && !prevProps.connected) {
            this.props.getCurrentData();
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }
        if (!this.state.holdings || Object.entries(this.props.currentData).length === 0) {
            return null;
        }

        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <h1 className="center">Innehav</h1>
                        <HoldingsTable
                            currentData={this.props.currentData}
                            holdings={this.state.holdings}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Holdings;
