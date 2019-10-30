import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../Header/Header';
import Listings from '../Listings/Listings';
import Asset from '../Asset/Asset';
import Holdings from '../Account/Holdings';
import Deposit from '../Account/Deposit';
import Registration from '../Registration/Registration';
import Login from '../Auth/Login';
import Logout from '../Auth/Logout';

import config from '../../config';

class App extends Component {
    assets = ['bitcoin', 'ethereum', 'litecoin'];
    ws = new WebSocket(config.wsURL);

    constructor(props) {
        super(props);
        this.getCurrentData = this.getCurrentData.bind(this);
        this.getHistData = this.getHistData.bind(this);
        this.setToken = this.setToken.bind(this);

        const assetsHist = {}, assetsRt = {};

        for (const asset of this.assets) {
            assetsHist[asset + 'Hist'] = [];
            assetsRt[asset + 'Rt'] = { timestamp: 0 };
        }

        this.state = {
            connected: false,
            token: '',
            currentData: {},
            rtData: {},
            ...assetsHist,
            ...assetsRt
        };
    }

    getCurrentData() {
        this.ws.send('getCurrentData');
    }

    getHistData(asset) {
        this.ws.send(asset);
    }

    setToken(token) {
        this.setState({ token: token });
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('Connected.');
            this.setState({ connected: true });
        };
        this.ws.onmessage = event => {
            let assetHist, assetRt, rtData, currentTS, timeDiff, index;
            const interval = 10; // s
            const maxTime = 3600; // s
            const message = JSON.parse(event.data);

            if (message.rtData) {
                assetHist = message.rtData.asset + 'Hist';
                assetRt = message.rtData.asset + 'Rt';
                rtData = message.rtData.data;
                this.setState({ [assetRt]: rtData, rtData: message.rtData });

                if (this.state[assetHist].length > 0) {
                    currentTS = this.state[assetHist][this.state[assetHist].length - 1].timestamp;

                    // Save realtime data if it's more than 'interval' seconds
                    // since data for the asset was saved last time
                    if (rtData.timestamp - currentTS >= interval * 1000) {
                        timeDiff = rtData.timestamp - this.state[assetHist][0].timestamp;

                        // Remove first element from hist data if it's more than 'maxTime' seconds
                        // between the first and last element in the array
                        index = timeDiff >= maxTime * 1000 ? 1 : 0;
                        this.setState(prevState => ({
                            [assetHist]: [...prevState[assetHist].slice(index), rtData]
                        }));
                    }
                }
            } else if (message.histData) {
                assetHist = message.histData.asset + 'Hist';
                this.setState({ [assetHist]: message.histData.data });
            } else if (message.currentData) {
                this.setState({ currentData: message.currentData });
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected.');
            this.setState({ connected: false });
        };
    }

    render() {
        const assetRoutes = this.assets.map((asset, key) => {
            return (
                <Route
                    exact path={'/asset/' + asset}
                    render={(props) =>
                        <Asset
                            {...props}
                            connected={this.state.connected}
                            token={this.state.token}
                            asset={asset}
                            getHistData={this.getHistData}
                            histData={this.state[asset + 'Hist']}
                            rtData={this.state[asset + 'Rt']}
                        />
                    }
                    key={key}
                />
            );
        });

        return (
            <Router>
                <Header token={this.state.token} />
                <Switch>
                    {assetRoutes}
                    <Route
                        exact path='/'
                        render={(props) =>
                            <Listings
                                {...props}
                                connected={this.state.connected}
                                assets={this.assets}
                                getCurrentData={this.getCurrentData}
                                currentData={this.state.currentData}
                                rtData={this.state.rtData}
                            />
                        }
                    />
                    <Route
                        exact path='/holdings'
                        render={(props) =>
                            <Holdings
                                {...props}
                                connected={this.state.connected}
                                token={this.state.token}
                                getCurrentData={this.getCurrentData}
                                currentData={this.state.currentData}
                            />
                        }
                    />
                    <Route
                        exact path='/deposit'
                        render={(props) =>
                            <Deposit
                                {...props}
                                token={this.state.token}
                            />
                        }
                    />
                    <Route
                        exact path='/register'
                        render={(props) =>
                            <Registration
                                {...props}
                                setToken={this.setToken}
                            />
                        }
                    />
                    <Route
                        exact path='/login'
                        render={(props) =>
                            <Login
                                {...props}
                                setToken={this.setToken}
                            />
                        }
                    />
                    <Route
                        exact path='/logout'
                        render={(props) =>
                            <Logout
                                {...props}
                                setToken={this.setToken}
                            />
                        }
                    />
                </Switch>
            </Router>
        );
    }
}

export default App;
