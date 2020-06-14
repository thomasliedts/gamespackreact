import React from 'react';
import PropTypes from 'prop-types';

const Register = (props) => {
  return (
    <div>
      <h1 className='text-center'>Enregistrez vous</h1>
      <form>
        <div className='form-group'>
          <input type='texxt' className='form-control' placeholder='Pseudo' />
        </div>
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
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            placeholder='Validez votre mot de passe'
          />
        </div>
        <button type='submit' class='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  );
};

Register.propTypes = {};

export default Register;
