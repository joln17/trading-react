import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

class HoldingsTable extends Component {
    static propTypes = {
        currentData: PropTypes.object.isRequired,
        holdings: PropTypes.array.isRequired
    };

    render() {
        const balanceIndex = this.props.holdings.findIndex(value => {
            return value.name === 'Saldo';
        });
        const balance = balanceIndex >= 0 ? this.props.holdings[balanceIndex].quantity : 0;
        const holdings = [
            ...this.props.holdings.slice(0, balanceIndex),
            ...this.props.holdings.slice(balanceIndex + 1)
        ];

        let totalValue = balance;

        holdings.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });

        const holdingRows = holdings.map((asset, key) => {
            const name = asset.name.charAt(0).toUpperCase() + asset.name.slice(1);
            const currentPrice = +this.props.currentData.price[asset.name];
            const value = currentPrice * asset.quantity;
            const change = 100 * ((currentPrice - asset.price) / asset.price);

            totalValue += value;

            return (
                <tr key={key}>
                    <td><Link to={'/asset/' + asset.name}>{name}</Link></td>
                    <td className="right">{asset.quantity}</td>
                    <td className="right">${currentPrice.toFixed(2)}</td>
                    <td className="right">{change.toFixed(2)} %</td>
                    <td className="right">${value.toFixed(2)}</td>
                </tr>
            );
        });

        return (
            <Table responsive="sm" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Namn</th>
                        <th className="right">Antal</th>
                        <th className="right">Senast</th>
                        <th className="right">Avkastn.</th>
                        <th className="right">Värde</th>
                    </tr>
                </thead>
                <tbody>
                    {holdingRows}
                    <tr>
                        <td colSpan="4" className="right">Saldo</td>
                        <td className="right">${balance.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="4" className="right">Totalt värde</td>
                        <td className="right">${totalValue.toFixed(2)}</td>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

export default HoldingsTable;
