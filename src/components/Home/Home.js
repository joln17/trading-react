import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Chart from '../Chart/Chart';

class Home extends Component {
    ws = new WebSocket('ws://localhost:8300');

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            lastTS: 0
        };
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('Connected.');
        };
        this.ws.onmessage = event => {
            let currentTS;
            const message = JSON.parse(event.data);

            if (this.state.data.length === 0 && message.histData) {
                // Get historical data before making realtime updates

                this.setState({ data: this.state.data.concat(message.histData) });
                currentTS = this.state.data[this.state.data.length - 1].timestamp;
                this.setState({ lastTS: currentTS });
            } else if (this.state.data.length !== 0 && message.rtData) {
                // Get realtime updates

                currentTS = this.state.data[this.state.data.length - 1].timestamp;
                if (currentTS === this.state.lastTS) {
                    // Save update permanently

                    this.setState({ data: this.state.data.concat(message.rtData) });
                } else {
                    // Overwrite last update

                    this.setState({ data: this.state.data.slice(0, -1).concat(message.rtData) });
                    currentTS = this.state.data[this.state.data.length - 1].timestamp;
                    if (currentTS - this.state.lastTS >= 5000) {
                        this.setState({ lastTS: currentTS });
                    }
                }
            }
            if (this.state.data.length > 720) {
                this.setState({ data: this.state.data.slice(1) });
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected.');
            // automatically try to reconnect on connection loss
        };
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <Chart data={this.state.data} />
                        <h1>
                            {this.state.data.length !== 0 ?
                                this.state.data[this.state.data.length - 1].bitcoin :
                                null
                            }
                        </h1>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;
