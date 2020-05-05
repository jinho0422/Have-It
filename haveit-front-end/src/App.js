import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from './components/user/LoginPage';
// import LoginPage from './components/LoginPage';
import RegisterPage from './components/user/RegisterPage';
// import RegisterPage from './components/RegisterPage';
import MainPage from './components/MainPage'
import NotFound from './components/information/NotFound'

const App = () => {
  return (
    <Switch>
      <Route component={LoginPage} exact path="/" />
      <Route component={RegisterPage} path="/register" />
      <Route component={MainPage} path="/main" />
      <Route component={NotFound} />
    </Switch>
  );
};
export default App;
