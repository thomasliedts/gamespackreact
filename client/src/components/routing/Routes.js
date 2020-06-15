import React from 'react';
import { Route, Switch } from 'react-router-dom';
import About from '../pages/About';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Alert from '../layout/Alert';
import DashboardAdmin from '../pages/DashboardAdmin';
import Dashboard from '../pages/Dashboard';

const Routes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/about' component={About} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/admin' component={DashboardAdmin} />
        <Route exact path='/dashboard' component={Dashboard} />
      </Switch>
    </section>
  );
};
export default Routes;
