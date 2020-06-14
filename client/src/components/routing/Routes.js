import React from 'react';
import { Route, Switch } from 'react-router-dom';
import About from '../pages/About';
import Login from '../auth/Login';
import Register from '../auth/Register';

const Routes = () => {
  return (
    <section className='container'>
      <Switch>
        <Route exact path='/about' component={About} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
      </Switch>
    </section>
  );
};
export default Routes;
