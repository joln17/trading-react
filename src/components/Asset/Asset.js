import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';

import Chart from './Chart';
import Trade from './Trade';

class Asset extends Component {
    static propTypes = {
        connected: PropTypes.bool.isRequired,
        asset: PropTypes.string.isRequired,
        getHistData: PropTypes.func.isRequired,
        histData: PropTypes.array.isRequired,
        rtData: PropTypes.object.isRequired
    };

    componentDidMount() {
        if (this.props.connected) {
            this.props.getHistData(this.props.asset);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.connected && !prevProps.connected) {
            this.props.getHistData(this.props.asset);
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }} className="card">
                        <h1 className="right">
                            {this.props.asset + ": $" + this.props.rtData.value}
                        </h1>
                        <Chart asset={this.props.asset} data={this.props.histData} />
                        <Trade asset={this.props.asset} rtData={this.props.rtData} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Asset;
