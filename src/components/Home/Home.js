import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'react-bootstrap';

import Chart from '../Chart/Chart';

class Home extends Component {
    static propTypes = {
        data: PropTypes.array
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <Chart data={this.props.data} />
                        <h1>
                            ${this.props.data.length !== 0 ?
                                this.props.data[this.props.data.length - 1].bitcoin :
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