import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Layout from '../../../components/Layout';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';

const ActivateAccount = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		buttonText: 'Activate Account',
		success: '',
		error: '',
	});

	const { name, success, error, buttonText } = state;

	useEffect(() => {
		let token = router.query.token;

		if (token) {
			try {
				const { name } = jwt.decode(token);
				setState({
					...state,
					name,
					token,
				});
			} catch (error) {
				alert('invalid token');
			}
		}
	}, [router]);

	const clickSubmit = async (event) => {
		event.preventDefault();
		setState({ ...state, buttonText: 'Activating ...' });

		try {
			const response = await axios.post(`${API}/register/activate`, { token });
			console.log(response);

			setState({
				...state,
				name: '',
				token: '',
				buttonText: 'Activated',
				success: response.data.message,
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				buttonText: 'Activate Account',
				error: error.response.data.error,
			});
		}
	};

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h1>Welcome {name}, Ready to activate your account?</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					<button
						onClick={clickSubmit}
						className='btn btn-outline-warning btn-block'>
						{buttonText}
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default withRouter(ActivateAccount);
