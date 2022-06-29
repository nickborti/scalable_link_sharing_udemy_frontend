import React, { useState } from 'react';
import axios from 'axios';

import Layout from '../components/Layout';

const register = () => {
	const [state, setState] = useState({
		name: '',
		email: '',
		password: '',
		error: '',
		success: '',
		buttonText: 'Register',
	});

	const { name, email, password, buttonText, error, success } = state;

	const handleChange = (name) => (event) => {
		setState({
			...state,
			[name]: event.target.value,
			error: '',
			success: '',
			buttonText: 'Register',
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		axios
			.post('http://localhost:5000/api/register', {
				name,
				email,
				password,
			})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => console.log(error));
	};

	const registerForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					type='text'
					className='form-control'
					placeholder='Type your name'
					value={name}
					onChange={handleChange('name')}
				/>
			</div>
			<div className='form-group'>
				<input
					type='email'
					className='form-control'
					placeholder='Type your email'
					value={email}
					onChange={handleChange('email')}
				/>
			</div>
			<div className='form-group'>
				<input
					type='password'
					className='form-control'
					placeholder='Type your password'
					value={password}
					onChange={handleChange('password')}
				/>
			</div>
			<div className='form-group'>
				<button className='btn btn-outline-warning'>{buttonText}</button>
			</div>
		</form>
	);
	return (
		<Layout>
			<div className='col-md-6 offset-md-3'>
				<h1>Register</h1>
				<br />
				{registerForm()}
			</div>
		</Layout>
	);
};

export default register;
