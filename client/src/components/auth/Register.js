import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Register = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      console.log('success');
    }
  };

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

Register.propTypes = {};

export default Register;
