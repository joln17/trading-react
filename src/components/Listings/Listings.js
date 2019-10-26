import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';

import ListingsTable from './ListingsTable';

class Listings extends Component {
    static propTypes = {
        connected: PropTypes.bool.isRequired,
        assets: PropTypes.array.isRequired,
        getCurrentData: PropTypes.func.isRequired,
        currentData: PropTypes.object.isRequired,
        rtData: PropTypes.object.isRequired
    };

    componentDidMount() {
        if (this.props.connected) {
            this.props.getCurrentData();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.connected && !prevProps.connected) {
            this.props.getCurrentData();
        }
    }

    render() {
        if (Object.entries(this.props.currentData).length === 0) {
            return null;
        }

        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <h1 className="center">Aktuella kurser</h1>
                        <ListingsTable
                            assets={this.props.assets}
                            currentData={this.props.currentData}
                            rtData={this.props.rtData}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Listings;
