import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import config from '../../config';
import DatePicker from './DatePicker/DatePicker';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.log = this.log.bind(this);
        this.setPasswordVisibility = this.setPasswordVisibility.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            emailInput: '',
            passwordInput: '',
            nameInput: '',
            birthdateInput: '',
            passwordInputType: 'password',
            passwordInputIcon: 'visibility',
            redirect: ''
        };
    }

    log(date) {
        this.setState({
            birthdateInput: date
        });
    }

    setPasswordVisibility() {
        if (this.state.passwordInputType === 'password') {
            this.setState({
                passwordInputType: 'text',
                passwordInputIcon: 'visibility_off'
            });
        } else {
            this.setState({
                passwordInputType: 'password',
                passwordInputIcon: 'visibility'
            });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const urlRegister = config.baseURL + '/auth/register';

        fetch(urlRegister, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.emailInput,
                password: this.state.passwordInput,
                name: this.state.nameInput,
                birthdate: this.state.birthdateInput
            })
        }).then(response => {
            return response.json();
        }).then(result => {
            if (result.data && result.data.token) {
                localStorage.setItem('token', result.data.token);
                this.setState({ redirect: '/deposit' });
            }
        }).catch(error => {
            console.log("Request failed due to the following error: ", error.message);
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }
        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <h1 className="center">Registrera nytt konto</h1>
                    </Col>
                    <Col md={{ span: 4, offset: 4 }}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formName">
                                <Form.Label>Namn</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nameInput"
                                    onChange={this.handleChange}
                                    maxLength="255"
                                    pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]+$" //eslint-disable-line
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formDate">
                                <Form.Label>Födelsedatum</Form.Label>
                                <DatePicker
                                    onChange={this.log}
                                    value={this.state.birthdateInput}
                                    disabled={false}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Epost<span className="red-text">*</span></Form.Label>
                                <Form.Control
                                    type="email"
                                    name="emailInput"
                                    onChange={this.handleChange}
                                    maxLength="255"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Lösenord<span className="red-text">*</span></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={this.state.passwordInputType}
                                        name="passwordInput"
                                        onChange={this.handleChange}
                                        minLength="8"
                                        maxLength="50"
                                        required
                                    />
                                    <InputGroup.Append>
                                        <Button variant="secondary"
                                            onClick={this.setPasswordVisibility}>
                                            <i className="form-input material-icons">
                                                {this.state.passwordInputIcon}
                                            </i>
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Minst 8 tecken.
                                </Form.Text>
                            </Form.Group>
                            <p><span className="red-text">*</span>) Anger obligatoriska fält</p>
                            <div className="center">
                                <Button variant="primary" type="submit">
                                    Registrera
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Registration;
