import React, { useState } from 'react';
import axios from 'axios';

import Layout from '../components/Layout';
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts';
import { API } from '../config';

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

	const handleSubmit = async (event) => {
		event.preventDefault();

		setState({ ...state, buttonText: 'Registering ...' });

		try {
			const response = await axios.post(`${API}/register`, {
				name,
				email,
				password,
			});

			setState({
				...state,
				name: '',
				email: '',
				password: '',
				buttonText: 'Submitted',
				success: response.data.message,
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				buttonText: 'Register',
				error: error.response.data.error,
			});
		}
	};

	const registerForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					type='text'
					className='form-control'
					placeholder='Type your name'
					value={name}
					required
					onChange={handleChange('name')}
				/>
			</div>
			<div className='form-group'>
				<input
					type='email'
					className='form-control'
					placeholder='Type your email'
					value={email}
					required
					onChange={handleChange('email')}
				/>
			</div>
			<div className='form-group'>
				<input
					type='password'
					className='form-control'
					placeholder='Type your password'
					value={password}
					required
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
