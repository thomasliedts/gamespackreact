import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    admin: false,
    password: '',
    password2: '',
  });

  const { name, email, admin, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, admin, password });
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/about' />;
  }

  return (
    <Fragment>
      <h1 className='text-center'>Enregistrez vous</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            placeholder='Pseudo'
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            className='form-control'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            placeholder='Email'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            placeholder='Mot de passe'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            placeholder='Validez votre mot de passe'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
