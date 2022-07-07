import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import { isAuth, logout } from '../helpers/auth';

// import 'nprogress/nprogress.css'; // from node-modules

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Layout = ({ children }) => {
	const [user, setAuthUser] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setAuthUser(isAuth());
		}
	}, []);
	// navigation
	const nav = () => (
		<ul className='nav nav-tabs'>
			{user && (
				<li className='nav-item'>
					<Link href='/'>
						<a className='nav-link'>Home</a>
					</Link>
				</li>
			)}

			{!user && (
				<>
					<li className='nav-item'>
						<Link href='/login'>
							<a className='nav-link'>Login</a>
						</Link>
					</li>
					<li className='nav-item'>
						<Link href='/register'>
							<a className='nav-link'>Register</a>
						</Link>
					</li>
				</>
			)}
			{user && user.role === 'admin' && (
				<li className='nav-item ml-auto'>
					<Link href='/admin'>
						<a className='nav-link text-dark'>Admin</a>
					</Link>
				</li>
			)}
			{user && user.role === 'subscriber' && (
				<li className='nav-item ml-auto'>
					<Link href='/user'>
						<a className='nav-link text-dark'>User</a>
					</Link>
				</li>
			)}
			{user && (
				<li className='nav-item'>
					<a onClick={logout} className='nav-link'>
						Logout
					</a>
				</li>
			)}
		</ul>
	);

	return (
		<>
			{nav()}
			<div className='container pt-5 pb-5'>{children}</div>
		</>
	);
};

export default Layout;
