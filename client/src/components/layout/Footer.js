import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Footer = ({ auth: { isAuthenticated, loading, user } }) => {
  const adminLink = (
    <ul>
      <li>
        <Link to='/admin'>Dashboard</Link>
      </li>
    </ul>
  );
  console.log(user);
  return (
    <div className='footer'>
      <p style={{ color: 'red' }}>Ceci est le footer du site</p>
      {!loading && isAuthenticated && (
        <Fragment>{user.admin ? adminLink : ''}</Fragment>
      )}
    </div>
  );
};

Footer.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user,
});

export default connect(mapStateToProps, {})(Footer);
