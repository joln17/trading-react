import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import config from '../../config';

class Deposit extends Component {
    static propTypes = {
        token: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            quantityInput: '',
            redirect: ''
        };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const urlDeposit = config.baseURL + '/account/deposit';

        fetch(urlDeposit, {
            method: 'POST',
            headers: {
                'x-access-token': this.props.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quantity: this.state.quantityInput
            })
        }).then(response => {
            return response.json();
        }).then(result => {
            if (result.data) {
                this.setState({ redirect: '/holdings' });
            } else if (result.error) {
                if (result.error.message === "Failed authentication" ||
                    result.error.message === "No token provided") {
                    this.setState({ redirect: '/login' });
                } else {
                    console.log(result.error);
                }
            }
        }).catch(error => {
            console.log("Request failed due to the following error: ", error.message);
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        } else if (!this.props.token) {
            return <Redirect to='/login' />;
        }
        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }} className="card">
                        <h1 className="center">Insättning</h1>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formQuantity">
                                <Form.Label>Belopp</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantityInput"
                                    min="0"
                                    step="0.01"
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>
                            <div className="center">
                                <Button variant="primary" type="submit" className="form-button">
                                    Genomför insättning
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Deposit;
