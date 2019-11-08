import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Header from './components/header/main';
import CharactersPage from './pages/characters';
import NotFound from './pages/not_found';
import Details from './pages/details';

class App extends Component<{}, {}> {
  render() {
    return (
      <Router>
        <div className="wrapper">
          <div className="container col-xl-8 col-12 offset-xl-2">
            <Header />
            <Switch>
              <Redirect exact from="/" to="/characters" />
              <Route exact path="/characters" component={CharactersPage} />
              <Route exact path="/characters/:id" component={Details} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
