import React from 'react';
import PropTypes from 'prop-types';

const Login = (props) => {
  return (
    <div>
      <h1 className='text-center'>Connectez vous</h1>
      <form>
        <div className='form-group'>
          <input type='email' className='form-control' placeholder='Email' />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            placeholder='Mot de passe'
          />
        </div>
        <button type='submit' class='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );
};

Login.propTypes = {};

export default Login;
