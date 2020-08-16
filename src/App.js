import React from 'react';
import './App.css';
import { Router } from 'react-router-dom';

import history from './services/history';
import Routes from './routes';

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Routes />
      </Router>
    );
  }
}
