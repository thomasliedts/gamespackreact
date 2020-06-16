import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading, user } }) => {
  const authLinks = (
    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
      <ul className='navbar-nav mr-auto mx-auto  '>
        <li className='nav-item '>
          <Link className='nav-link' to='/games'>
            Jeux
          </Link>
        </li>
        <li className='nav-item '>
          <Link className='nav-link' to='/dashboard'>
            Dashboard
          </Link>
        </li>
        <li className='nav-item '>
          <a className='nav-link' onClick={logout} href='#!'>
            <i className='fas fa-sign-out-alt'></i> Log Out
          </a>
        </li>
      </ul>
    </div>
  );

  const guestLinks = (
    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
      <ul className='navbar-nav mr-auto mx-auto  '>
        <li className='nav-item '>
          <Link className='nav-link' to='/games'>
            Jeux
          </Link>
        </li>
        <li className='nav-item '>
          <Link className='nav-link' to='/login'>
            Connexion
          </Link>
        </li>
        <li className='nav-item '>
          <Link className='nav-link' to='/register'>
            Inscription
          </Link>
        </li>
      </ul>
    </div>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark header '>
      <Link className='navbar-brand' to='/'>
        GamesPack
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks} </Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
