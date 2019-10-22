import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

class HoldingsTable extends Component {
    static propTypes = {
        priceData: PropTypes.object,
        holdings: PropTypes.array
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

        const holdingRows = holdings.map((security, index) => {
            let name = security.name.charAt(0).toUpperCase() + security.name.slice(1);
            const currentPrice = +this.props.priceData[security.name];
            const value = currentPrice * security.quantity;
            const change = 100 * ((currentPrice - security.price) / security.price);

            totalValue += value;

            return <tr key={index}>
                <td>{name}</td>
                <td className="right">{security.quantity}</td>
                <td className="right">${currentPrice.toFixed(2)}</td>
                <td className="right">{change.toFixed(2)} %</td>
                <td className="right">${value.toFixed(2)}</td>
            </tr>;
        });

        return (
            <Table striped bordered hover size="sm">
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
