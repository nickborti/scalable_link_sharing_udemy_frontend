import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';

// import 'nprogress/nprogress.css'; // from node-modules

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
	// navigation
	const nav = () => (
		<ul className='nav nav-tabs'>
			<li className='nav-item'>
				<Link href='/'>
					<a className='nav-link'>Home</a>
				</Link>
			</li>
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
