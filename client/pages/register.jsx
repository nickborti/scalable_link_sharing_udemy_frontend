import React, { useState } from 'react';
import axios from 'axios';

import Layout from '../components/Layout';
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts';

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
		setState({ ...state, buttonText: 'Registering ...' });

		axios
			.post('http://localhost:5000/api/register', {
				name,
				email,
				password,
			})
			.then((response) => {
				setState({
					...state,
					name: '',
					email: '',
					password: '',
					buttonText: 'Submitted',
					success: response.data.message,
				});
			})
			.catch((error) => {
				setState({
					...state,
					buttonText: 'Register',
					error: error.response.data.error,
				});
			});
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
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{registerForm()}
			</div>
		</Layout>
	);
};

export default register;
