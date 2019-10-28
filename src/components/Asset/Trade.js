import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Button, ButtonToolbar, Form } from 'react-bootstrap';

import config from '../../config';

import './Trade.css';

class Trade extends Component {
    static propTypes = {
        asset: PropTypes.string.isRequired,
        rtData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            quantityInput: '',
            priceInput: '',
            redirect: '',
            isLoggedIn: false
        };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleClick(e) {
        const quantity = this.state.quantityInput;

        if (!isNaN(parseFloat(quantity)) && isFinite(quantity)) {
            const urlDeposit = config.baseURL + '/trade/' + e.target.name;

            fetch(urlDeposit, {
                method: 'POST',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.props.asset,
                    quantity: quantity,
                    price: this.props.rtData.value
                })
            }).then(response => {
                return response.json();
            }).then(result => {
                if (result.data) {
                    this.setState({ redirect: '/holdings' });
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
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
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
                    if (result.error.message === "Failed authentication") {
                        localStorage.removeItem('token');
                    } else {
                        console.log(result.error);
                    }
                }
            }).catch(error => {
                console.log("Request failed due to the following error: ", error.message);
            });
        }
    }

    render() {
        if (!this.state.isLoggedIn) {
            return null;
        }
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }
        return (
            <div>
                <h3 className="center trade">Handla</h3>
                <Form>
                    <Form.Group controlId="formQuantity">
                        <Form.Label>Antal</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantityInput"
                            min="0"
                            step="0.01"
                            onChange={this.handleChange}
                            required
                        />
                    </Form.Group>
                    <ButtonToolbar className="flex-center">
                        <Button
                            variant="primary"
                            type="button"
                            name="buy"
                            className="toolbar-button"
                            onClick={this.handleClick}
                        >
                            Köp
                        </Button>
                        <Button variant="primary"
                            type="button"
                            name="sell"
                            className="toolbar-button"
                            onClick={this.handleClick}
                        >
                            Sälj
                        </Button>
                    </ButtonToolbar>
                </Form>
            </div>
        );
    }
}

export default Trade;
