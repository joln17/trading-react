import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

//import headerImg from '../../assets/images/header_1920.jpg';

import './Header.css';

class Header extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            adminOption: null,
            titlesFetched: null,
            loginMenu: 'Logga in',
            isLoggedIn: false
        };
    }

    render() {
        let holdingsNav = null, depositNav = null, loginNav;
        const path = this.props.location.pathname.match(/^\/[^/]*/);

        if (localStorage.getItem('token')) {
            holdingsNav = <Nav.Link as={Link} to="/holdings" active={path[0] === "/holdings"}>
                Innehav
            </Nav.Link>;
            depositNav = <Nav.Link as={Link} to="/deposit" active={path[0] === "/deposit"}>
                Insättning
            </Nav.Link>;
            loginNav = <Nav.Link as={Link} to="/logout" active={path[0] === "/login"}>
                Logga ut
            </Nav.Link>;
        } else {
            loginNav = <Nav.Link as={Link} to="/login" active={path[0] === "/login"}>
                Logga in
            </Nav.Link>;
        }

        return (
            <header>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="navbar">
                    <Navbar.Brand as={Link} to="/">Kryptohandel</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/" active={path[0] === "/"}>Kurser</Nav.Link>
                            {holdingsNav}
                            {depositNav}
                            {loginNav}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        );
    }
}

export default withRouter(Header);
