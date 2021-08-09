import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {
    Home,
    SingleVault,
    NavBar,
    Query,
    SingleStrategy,
} from './components/app';
import SignIn from './components/common/SignIn';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Risk } from './components/app/Risk';

class App extends React.Component {
    render() {
        return (
            <Router>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/query" component={Query} />
                    <Route
                        path="/query/:groupingId/group/:groups"
                        component={Query}
                    />
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
                    <AuthProvider>
                        <Route exact path="/signin" component={SignIn} />
                        <Route exact path="/signout" component={SignIn} />
                        <PrivateRoute exact path="/risk" component={Risk} />
                    </AuthProvider>
                </Switch>
            </Router>
        );
    }
}

export default App;
