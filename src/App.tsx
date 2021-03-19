import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';


import { Home, SingleVault, NavBar, SingleStrategy} from './components/app';




class App extends React.Component {
    render() {
        return (
            <BrowserRouter >
                <NavBar/>
          <Switch>
              <Route exact path="/" component={Home} />
               <Route exact path="/vault/:id" component={SingleVault} />
               <Route exact path="/strategy/:id" component={SingleStrategy} />
          </Switch>
        </BrowserRouter>
        );
    }
}

export default App;
