import React, { useEffect } from 'react';
import axios from 'axios';

import Layout from '../../components/Layout';
import { getCookie } from '../../helpers/auth';
import { API } from '../../config';
import withUser from '../withUser';

const User = ({ user, token }) => {
	return <Layout>{JSON.stringify(user)}</Layout>;
};

// User.getInitialProps = async context => {
// 	const token = getCookie('token', context.req);
// 	try {
// 		const response = await axios.get(`${API}/user`, {
// 			headers: {
// 				authorization: `Bearer ${token}`,
// 				contentType: 'application/json',
// 			},
// 		});

// 		return { user: response.data };
// 	} catch (error) {
// 		if (error.response.status === 401) {
// 			return { user: 'no user' };
// 		}
// 	}
// };

export default withUser(User);
