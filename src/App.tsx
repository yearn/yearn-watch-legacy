import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';


import { Home, StrategistList, SingleVault } from './components/app';



class App extends React.Component {
    render() {
        return (
        <BrowserRouter >
          <Switch>
              <Route exact path="/" component={Home} />
               <Route exact path="/vault/:id" component={SingleVault} />
               <Route exact path="/strategy" component={StrategistList} />
          </Switch>
        </BrowserRouter>
        );
    }
}

export default App;
