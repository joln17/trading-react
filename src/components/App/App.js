import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Listings from '../Listings/Listings';
import Asset from '../Asset/Asset';
import Holdings from '../Account/Holdings';
import Deposit from '../Account/Deposit';
import Registration from '../Registration/Registration';
import Login from '../Auth/Login';
import Logout from '../Auth/Logout';

class App extends Component {
    assets = ['bitcoin', 'ethereum', 'litecoin'];
    ws = new WebSocket('ws://localhost:8300');

    constructor(props) {
        super(props);
        this.getCurrentData = this.getCurrentData.bind(this);
        this.getHistData = this.getHistData.bind(this);

        const assetsHist = {}, assetsRt = {};

        for (const asset of this.assets) {
            assetsHist[asset + 'Hist'] = [];
            assetsRt[asset + 'Rt'] = { timestamp: 0 };
        }

        this.state = {
            connected: false,
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

                    if (rtData.timestamp - currentTS >= interval * 1000) {
                        timeDiff = rtData.timestamp - this.state[assetHist][0].timestamp;
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
            // automatically try to reconnect on connection loss
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
                                getCurrentData={this.getCurrentData}
                                currentData={this.state.currentData}
                            />
                        }
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
