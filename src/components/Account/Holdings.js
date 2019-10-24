import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';

import config from '../../config';

import HoldingsTable from './HoldingsTable';

class Holdings extends Component {
    static propTypes = {
        priceData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            holdings: null
        };
    }

    componentDidMount() {
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
                console.log(result.error);
            }
        }).catch(error => {
            console.log("Request failed due to the following error: ", error.message);
        });
    }

    render() {
        if (!this.state.holdings || this.props.priceData.timestamp === 0) {
            return null;
        }

        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <h1 className="center">Innehav</h1>
                        <HoldingsTable
                            priceData={this.props.priceData}
                            holdings={this.state.holdings}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Holdings;
