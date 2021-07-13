import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Home, SingleVault, NavBar, SingleStrategy } from './components/app';
import SignIn from './components/common/SignIn';
import { AuthProvider } from './contexts/AuthContext';

class App extends React.Component {
    render() {
        return (
            <Router>
                <AuthProvider>
                    <NavBar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/signin" component={SignIn} />
                        <Route
                            exact
                            path="/vault/:id"
                            component={SingleVault}
                        />
                        <Route
                            exact
                            path="/strategy/:name/:id"
                            component={SingleStrategy}
                        />
                    </Switch>
                </AuthProvider>
            </Router>
        );
    }
}

export default App;
