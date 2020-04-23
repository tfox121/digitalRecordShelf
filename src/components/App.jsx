import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container, Segment } from 'semantic-ui-react';

import history from '../history';
import './App.css';

import Main from './Main';

const App = () => (
  <Router history={history}>
    <Container>
      <Segment inverted className="app">
        <Switch>
          <Route path="/" exact component={Main} />
        </Switch>
      </Segment>
    </Container>
  </Router>
);

export default App;
