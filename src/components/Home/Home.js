import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Chart from '../Chart/Chart';

class Home extends Component {
    ws = new WebSocket('ws://localhost:8300');

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('Connected.');
        };
        this.ws.onmessage = event => {
            const data = JSON.parse(event.data);

            this.setState({ data: this.state.data.concat(data) });
            console.log(data);
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
