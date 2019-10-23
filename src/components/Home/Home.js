import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';

import Chart from '../Chart/Chart';

class Home extends Component {
    static propTypes = {
        connected: PropTypes.bool,
        getHistory: PropTypes.func.isRequired,
        histData: PropTypes.object,
        rtData: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            histData: [],
            rtData: { timestamp: 0 }
        };
    }

    componentDidMount() {
        if (this.props.connected) {
            this.props.getHistory('bitcoin');
        }
    }

    componentDidUpdate(prevProps) {
        const interval = 10; // s
        const maxTime = 3600; // s

        if (this.props.connected && !prevProps.connected) {
            this.props.getHistory('bitcoin');
        }

        const timestamp = this.props.histData.data ?
            this.props.histData.data[this.props.histData.data.length - 1].timestamp :
            0;
        const prevTimestamp = prevProps.histData.data ?
            prevProps.histData.data[prevProps.histData.data.length - 1].timestamp :
            0;

        if (this.props.histData.asset === 'bitcoin' &&
            timestamp > 0 && timestamp !== prevTimestamp) {
            this.setState({ histData: this.props.histData.data });
        }

        if (this.props.rtData.asset === 'bitcoin' &&
            this.props.rtData.data.timestamp !== this.state.rtData.timestamp) {
            this.setState({ rtData: this.props.rtData.data });
        }

        const lastTimestamp = this.state.histData.length > 0 ?
            this.state.histData[this.state.histData.length - 1].timestamp :
            null;

        if (lastTimestamp && this.state.rtData.timestamp - lastTimestamp > interval * 1000) {
            this.setState({ histData: this.state.histData.concat(this.state.rtData) });
            if (this.state.rtData.timestamp - this.state.histData[0].timestamp > maxTime * 1000) {
                this.setState({ histData: this.state.histData.slice(1) });
            }
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <Chart data={this.state.histData} />
                        <h1>
                            ${this.state.rtData.value}
                        </h1>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;
