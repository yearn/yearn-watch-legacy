import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';


import { Home } from './components/app';


class App extends React.Component {
    render() {
        return (
        <BrowserRouter >
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </BrowserRouter>
        );
    }
}

export default App;
