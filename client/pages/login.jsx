import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../components/Layout';
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';
import Router from 'next/router';

const login = () => {
	const [state, setState] = useState({
		email: '',
		password: '',
		error: '',
		success: '',
		buttonText: 'Login',
	});

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const { email, password, buttonText, error, success } = state;

	const handleChange = name => event => {
		setState({
			...state,
			[name]: event.target.value,
			error: '',
			success: '',
			buttonText: 'Login',
		});
	};

	const handleSubmit = async event => {
		event.preventDefault();

		setState({ ...state, buttonText: 'Logging in ...' });

		try {
			const response = await axios.post(`${API}/login`, {
				email,
				password,
			});

			authenticate(response, () => {
				isAuth() && isAuth().role === 'admin'
					? Router.push('/admin')
					: Router.push('/user');
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				buttonText: 'Login',
				error: error.response.data.error,
			});
		}
	};

	const loginForm = () => (
		<form onSubmit={handleSubmit}>
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
				<h1>Login</h1>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{loginForm()}
			</div>
		</Layout>
	);
};

export default login;
