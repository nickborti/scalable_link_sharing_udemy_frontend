import cookie from 'js-cookie';
import Router from 'next/router';

// set cookie
export const setCookie = (key, value) => {
	// NextJS runs both on client and server side
	// Check if it's a browser
	if (typeof window !== 'undefined') {
		cookie.set(key, value, {
			expires: 7, // 7 day
		});
	}
};

// remove cookie
export const removeCookie = key => {
	// NextJS runs both on client and server side
	// Check if it's a browser
	if (typeof window !== 'undefined') {
		cookie.remove(key);
	}
};

// get cookie
export const getCookie = key => {
	// NextJS runs both on client and server side
	// Check if it's a browser
	if (typeof window !== 'undefined') {
		return cookie.get(key);
	}
};

// localStorage setitem
export const setLocalStorage = (key, value) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

// localstorage removeitem
export const removeLocalStorage = key => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(key);
	}
};

// authenticate user to pass info through cookie and localStorage
export const authenticate = (payload, next) => {
	setCookie('token', payload.data.token);
	setLocalStorage('user', payload.data.user);
	next();
};

// Check if user is authenticated and return user
export const isAuth = () => {
	const cookieChecked = getCookie('token');
	if (cookieChecked !== 'undefined') {
		if (typeof window !== 'undefined') {
			const user = localStorage.getItem('user');
			if (user !== 'undefined') {
				return JSON.parse(user);
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export const logout = () => {
	removeLocalStorage('user');
	removeCookie('token');
	Router.push('/login');
};
