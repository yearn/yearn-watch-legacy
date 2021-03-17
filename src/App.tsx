import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';


import { Home, StrategistList } from './components/app';



class App extends React.Component {
    render() {
        return (
        <BrowserRouter >
          <Switch>
              <Route exact path="/" component={Home} />
               <Route exact path="/strategy" component={StrategistList} />
          </Switch>
        </BrowserRouter>
        );
    }
}

export default App;
