import React, { useEffect, useState } from 'react';
import Router, { withRouter } from 'next/router';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';
import {
	showErrorMessage,
	showSuccessMessage,
} from '../../../../helpers/alerts';
import { API } from '../../../../config';

const ResetPassword = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		newPassword: '',
		buttonText: 'Reset Password',
		success: '',
		error: '',
	});

	const { name, token, newPassword, success, error, buttonText } = state;

	useEffect(() => {
		const decoded = jwt.decode(router.query.id);
		if (decoded) {
			setState({
				...state,
				name: decoded.name,
				token: router.query.id,
			});
		}
	}, [router]);

	const handleChange = e => {
		setState({
			...state,
			newPassword: e.target.value,
		});
	};

	const clickSubmit = async event => {
		event.preventDefault();
		setState({ ...state, buttonText: 'Reseting ...' });
		console.log('post email to email');

		try {
			const response = await axios.put(`${API}/reset-password`, {
				newPassword,
				resetPasswordLink: token,
			});
			console.log(response);
			setState({
				...state,
				newPassword: '',
				buttonText: 'Reset Password',
				success: response.data.message,
				error: '',
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				buttonText: 'Reset Password',
				error: error.response.data.error,
				success: '',
			});
		}
	};

	const resetPasswordForm = () => (
		<form>
			<div className='form-group'>
				<input
					type='password'
					className='form-control'
					onChange={handleChange}
					value={newPassword}
					placeholder='Type your new password'
					required
				/>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h1>Hi {name}, Ready to reset password?</h1>
					<br />
					{resetPasswordForm()}
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

export default withRouter(ResetPassword);
