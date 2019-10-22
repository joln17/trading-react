import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from '../Home/Home';
import Holdings from '../Account/Holdings';
import Deposit from '../Account/Deposit';
import Registration from '../Registration/Registration';
import Login from '../Auth/Login';
import Logout from '../Auth/Logout';

class App extends Component {
    ws = new WebSocket('ws://localhost:8300');

    constructor(props) {
        super(props);
        this.state = {
            rtData: { timestamp: 0 },
            data: [],
            lastTS: 0
        };
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('Connected.');
            this.ws.send('getHistory');
        };
        this.ws.onmessage = event => {
            let currentTS;
            const message = JSON.parse(event.data);

            if (message.rtData) {
                this.setState({ rtData: message.rtData });
            }

            if (this.state.data.length === 0 && message.histData) {
                // Get historical data before making realtime updates
                this.setState({ data: this.state.data.concat(message.histData) });
            } else if (this.state.data.length !== 0 && message.rtData) {
                // Get realtime updates
                currentTS = this.state.data[this.state.data.length - 1].timestamp;
                if (message.rtData.timestamp - currentTS >= 10000) {
                    this.setState({ data: this.state.data.concat(message.rtData) });
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
            <Router>
                <Switch>
                    <Route
                        exact path='/'
                        render={(props) => <Home {...props} data={this.state.data} />}
                    />
                    <Route
                        exact path='/holdings'
                        render={(props) => <Holdings {...props} priceData={this.state.rtData} />}
                    />
                    <Route exact path="/deposit" component={Deposit} />
                    <Route exact path="/register" component={Registration} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                </Switch>
            </Router>
        );
    }
}

export default App;
