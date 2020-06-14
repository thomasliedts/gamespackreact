import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log('success');
  };

  return (
    <Fragment>
      <h1 className='text-center'>Connectez vous</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            className='form-control'
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            placeholder='Mot de passe'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </Fragment>
  );
};

Login.propTypes = {};

export default Login;
