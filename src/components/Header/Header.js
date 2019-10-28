import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

import './Header.css';

class Header extends Component {
    static propTypes = {
        token: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired
    };

    render() {
        let holdingsNav = null, depositNav = null, loginNav;
        const path = this.props.location.pathname.match(/^\/[^/]*/);

        if (this.props.token) {
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
                <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" className="navbar">
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
