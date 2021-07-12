import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Home, SingleVault, NavBar, SingleStrategy } from './components/app';
import SignIn from './components/common/SignIn';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/vault/:id" component={SingleVault} />
                    <Route
                        exact
                        path="/strategy/:name/:id"
                        component={SingleStrategy}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
