import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../../../components/Layout';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';

const ForgotPassword = () => {
	const [state, setState] = useState({
		email: '',
		buttonText: 'Send Email',
		success: '',
		error: '',
	});

	const { email, success, error, buttonText } = state;

	const handleChange = e => {
		setState({
			...state,
			email: e.target.value,
		});
	};

	const clickSubmit = async event => {
		event.preventDefault();
		setState({ ...state, buttonText: 'Sending Email ...' });
		console.log('post email to email');

		try {
			const response = await axios.put(`${API}/forgot-password`, { email });
			console.log(response);
			setState({
				...state,
				buttonText: 'Send Email',
				success: response.data.message,
				error: '',
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				buttonText: 'Send Email',
				error: error.response.data.error,
				success: '',
			});
		}
	};

	const passwordForgotForm = () => (
		<form>
			<div className='form-group'>
				<input
					type='email'
					className='form-control'
					onChange={handleChange}
					value={email}
					placeholder='Type your email'
					required
				/>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h1>Forgot Password</h1>
					<br />
					{passwordForgotForm()}
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					<button onClick={clickSubmit} className='btn btn-outline-warning'>
						{buttonText}
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default ForgotPassword;
