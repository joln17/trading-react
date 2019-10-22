import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import config from '../../config';

class Deposit extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            isLoggedIn: false,
            quantityInput: '',
            redirect: false
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
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quantity: this.state.quantityInput
            })
        }).then(response => {
            return response.json();
        }).then(result => {
            if (result.data) {
                this.setState({ redirect: true });
            } else if (result.error) {
                console.log(result.error);
            }
        }).catch(error => {
            console.log("Request failed due to the following error: ", error.message);
        });
    }

    componentDidMount() {
        const urlVerifyLogin = config.baseURL + '/auth/verify-login';

        fetch(urlVerifyLogin, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        }).then(response => {
            return response.json();
        }).then(result => {
            if (result.data) {
                this.setState({ isLoggedIn: true });
            } else if (result.error) {
                console.log(result.error);
            }
        }).catch(error => {
            console.log("Request failed due to the following error: ", error.message);
        });
    }

    render() {
        if (!this.state.isLoggedIn) {
            return null;
        }
        if (this.state.redirect) {
            return <Redirect to='/' />;
        }
        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <h1 className="center">Insättning</h1>
                    </Col>
                    <Col md={{ span: 4, offset: 4 }}>
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
                                <Button variant="primary" type="submit">
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
