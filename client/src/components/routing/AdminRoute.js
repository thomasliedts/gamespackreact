import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({
  component: Component,
  auth: { isAuhenticated, loading, user },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuhenticated && !loading && !user.admin ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AdminRoute);
