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
        this.getHistory = this.getHistory.bind(this);
        this.state = {
            connected: false,
            histData: {},
            rtData: { timestamp: 0 }
        };
    }

    getHistory(asset) {
        console.log(asset);
        this.ws.send('getHistory');
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('Connected.');
            this.setState({ connected: true });
        };
        this.ws.onmessage = event => {
            const message = JSON.parse(event.data);

            if (message.rtData) {
                this.setState({ rtData: message.rtData });
            }
            if (message.histData) {
                this.setState({ histData: message.histData });
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected.');
            this.setState({ connected: false });
            // automatically try to reconnect on connection loss
        };
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        exact path='/'
                        render={(props) =>
                            <Home
                                {...props}
                                connected={this.state.connected}
                                getHistory={this.getHistory}
                                histData={this.state.histData}
                                rtData={this.state.rtData}
                            />
                        }
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
