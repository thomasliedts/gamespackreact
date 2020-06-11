import React from 'react';
import { Route, Switch } from 'react-router-dom';
import About from '../pages/About';

const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/about' component={About} />
      </Switch>
    </div>
  );
};
export default Routes;
