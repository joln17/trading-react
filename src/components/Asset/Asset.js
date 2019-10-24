import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';

import Chart from './Chart';

class Asset extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        connected: PropTypes.bool.isRequired,
        getHistory: PropTypes.func.isRequired,
        histData: PropTypes.object.isRequired,
        rtData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            asset: this.props.match.params.asset,
            data: [],
            rtData: { timestamp: 0 }
        };
    }

    componentDidMount() {
        if (this.props.connected) {
            this.props.getHistory(this.state.asset);
        }
    }

    componentDidUpdate(prevProps) {
        const interval = 10; // s
        const maxTime = 3600; // s

        if (this.props.connected && !prevProps.connected) {
            this.props.getHistory(this.state.asset);
        }

        const timestamp = this.props.histData.data ?
            this.props.histData.data[this.props.histData.data.length - 1].timestamp :
            0;
        const prevTimestamp = prevProps.histData.data ?
            prevProps.histData.data[prevProps.histData.data.length - 1].timestamp :
            0;

        if (this.props.histData.asset === this.state.asset &&
            timestamp > 0 && timestamp !== prevTimestamp) {
            this.setState({ data: this.props.histData.data });
            if (this.state.rtData.timestamp === 0) {
                const lastHistData = this.props.histData.data[this.props.histData.data.length - 1];

                this.setState({ rtData: lastHistData });
            }
        }

        if (this.props.rtData.asset === this.state.asset &&
            this.props.rtData.data.timestamp !== this.state.rtData.timestamp) {
            this.setState({ rtData: this.props.rtData.data });
        }

        const lastTimestamp = this.state.data.length > 0 ?
            this.state.data[this.state.data.length - 1].timestamp :
            null;

        if (lastTimestamp && this.state.rtData.timestamp - lastTimestamp > interval * 1000) {
            this.setState({ data: this.state.data.concat(this.state.rtData) });
            if (this.state.rtData.timestamp - this.state.data[0].timestamp > maxTime * 1000) {
                this.setState({ data: this.state.data.slice(1) });
            }
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <Chart asset={this.state.asset} data={this.state.data} />
                        <h1>
                            ${this.state.rtData.value}
                        </h1>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Asset;
