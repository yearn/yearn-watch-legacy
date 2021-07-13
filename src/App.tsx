import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import {
    Home,
    SingleVault,
    NavBar,
    Query,
    SingleStrategy,
} from './components/app';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/query" component={Query} />
                    <Route
                        exact
                        path="/vault/:vaultId"
                        component={SingleVault}
                    />
                    <Route
                        exact
                        path="/vault/:vaultId/strategy/:strategyId"
                        component={SingleStrategy}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
