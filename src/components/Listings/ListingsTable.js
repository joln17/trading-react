import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

class ListingsTable extends Component {
    static propTypes = {
        assets: PropTypes.array.isRequired,
        currentData: PropTypes.object.isRequired,
        rtData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        const assets = {};

        for (const asset of props.assets) {
            assets[asset] = 0;
        }
        this.state = {
            ...assets
        };
    }

    componentDidMount() {
        if (this.props.currentData.timestamp) {
            this.setState({ ...this.props.currentData.price });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentData.timestamp !== prevProps.currentData.timestamp) {
            this.setState({ ...this.props.currentData.price });
        }

        if (this.props.rtData.data && prevProps.rtData.data &&
            (this.props.rtData.asset !== prevProps.rtData.asset ||
            this.props.rtData.data.value !== prevProps.rtData.data.value)) {
            this.setState({ [this.props.rtData.asset]: this.props.rtData.data.value });
        }
    }

    render() {
        const listingsRows = this.props.assets.map((asset, key) => {
            const name = asset.charAt(0).toUpperCase() + asset.slice(1);
            const price = +this.state[asset];

            return (
                <tr key={key}>
                    <td><Link to={'/asset/' + asset}>{name}</Link></td>
                    <td className="right">${price.toFixed(2)}</td>
                </tr>
            );
        });

        return (
            <Table responsive="sm" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Namn</th>
                        <th className="right">Pris</th>
                    </tr>
                </thead>
                <tbody>
                    {listingsRows}
                </tbody>
            </Table>
        );
    }
}

export default ListingsTable;
