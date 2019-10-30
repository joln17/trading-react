import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';

import config from '../../config';

import './Login.css';

class Login extends Component {
    static propTypes = {
        setToken: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.setPasswordVisibility = this.setPasswordVisibility.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            emailInput: '',
            passwordInput: '',
            passwordInputType: 'password',
            passwordInputIcon: 'visibility',
            redirect: '',
            alert: false
        };
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
        const urlLogin = config.baseURL + '/auth/login';

        fetch(urlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.emailInput,
                password: this.state.passwordInput,
            })
        }).then(response => {
            return response.json();
        }).then(result => {
            if (result.data && result.data.token) {
                this.props.setToken(result.data.token);
                this.setState({ redirect: '/holdings' });
            } else if (result.error) {
                if (result.error.message === "Email or password is wrong") {
                    this.setState({ alert: true });
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
        }
        const alert = this.state.alert ?
            <Alert variant="danger">
                Fel användarnamn eller lösenord.
            </Alert> :
            null;

        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }} className="card">
                        <h1 className="center">Logga in</h1>
                        <Form className="login-form" onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Epost</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="emailInput"
                                    onChange={this.handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Lösenord</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={this.state.passwordInputType}
                                        name="passwordInput"
                                        onChange={this.handleChange}
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
                            </Form.Group>
                            <div className="center">
                                <Button variant="primary" type="submit" className="form-button">
                                    Logga in
                                </Button>
                            </div>
                        </Form>
                        <div className="center">
                            Inget konto? <Link to="/register">Skapa konto.</Link>
                        </div>
                        {alert}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Login;
