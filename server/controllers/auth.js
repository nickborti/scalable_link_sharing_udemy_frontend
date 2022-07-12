const AWS = require('aws-sdk');
const jwtToken = require('jsonwebtoken');
const shortId = require('shortid');
const { expressjwt: jwt } = require('express-jwt');
const _ = require('lodash');

const {
	registerEmailParams,
	forgotPasswordEmailParams,
} = require('../helpers/email');
const User = require('../models/user');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
	const { name, email, password } = req.body;

	// Check user exists in DB
	User.findOne({ email }).exec((err, user) => {
		if (err) {
			console.log(error);
			return res.status(400).json({
				error: 'Something bad happened',
			});
		}

		if (user) {
			return res.status(400).json({
				error: 'Email is taken',
			});
		}

		// generate jwt token and send in email for verification
		const token = jwtToken.sign(
			{ name, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{
				expiresIn: '10m',
			}
		);

		// mail params
		const params = registerEmailParams(name, email, token);

		const sendEmailOnRegister = ses.sendEmail(params).promise();

		sendEmailOnRegister
			.then(data => {
				console.log('Email submitted to SES ', data);
				res.json({
					message: `Email has been sent to ${email}. Follow the instructions to complete your registration`,
				});
			})
			.catch(error => {
				console.log('ses email on register error ', error);
				res.status(400).json({
					error: 'We could not verify your email. Please try again',
				});
			});
	});
};

exports.activate = (req, res) => {
	const { token } = req.body;

	jwtToken.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				error: 'Expired link. Try again',
			});
		}

		const { name, email, password } = jwtToken.decode(token);
		const username = shortId.generate();

		User.findOne({ email }).exec((err, user) => {
			if (err) {
				return res.status(400).json({
					error: 'Something went wrong.',
				});
			}

			if (user) {
				return res.status(401).json({
					error: 'Email already exists',
				});
			}

			// create user
			const newUser = new User({
				username,
				name,
				email,
				password,
			});

			newUser.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: 'Error saving user in database. Try again ',
					});
				}

				return res.json({
					message: 'Registration success. Please login',
				});
			});
		});
	});
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	//   console.table({ email, password });

	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'Úser with that email does not exist',
			});
		}

		// authenticate
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: 'Email/Password do not match',
			});
		}

		// generate token and send to client
		const token = jwtToken.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});

		const { _id, name, email, role } = user;

		return res.json({
			token,
			user: { _id, name, email, role },
		});
	});
};

exports.requireSignin = jwt({
	secret: process.env.JWT_SECRET,
	algorithms: ['HS256'],
});

exports.authMiddleware = (req, res, next) => {
	const authUserId = req.auth._id;
	User.findOne({ _id: authUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User not found',
			});
		}

		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const adminUserId = req.auth._id;
	User.findOne({ _id: adminUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User not found',
			});
		}

		if (user.role !== 'admin') {
			return res.status(400).json({
				error: 'Access Denied',
			});
		}

		req.profile = user;
		next();
	});
};

exports.forgotPassword = (req, res) => {
	const { email } = req.body;

	User.findOne({ email }).exec((error, user) => {
		if (error || !user) {
			return res.status(400).json({
				error: 'Email does not exist',
			});
		}

		const token = jwtToken.sign(
			{ name: user.name },
			process.env.JWT_RESET_PASSWORD,
			{ expiresIn: '10m' }
		);

		// mail params
		const params = forgotPasswordEmailParams(email, token);

		// populate the db user with resetPassword link

		return user.updateOne({ resetPasswordLink: token }, (err, success) => {
			if (err) {
				return res.status(400).json({
					error: 'Password reset failed. Try again',
				});
			}

			const sendEmail = ses.sendEmail(params).promise();
			sendEmail
				.then(data => {
					console.log('ses reset pwd success ', data);
					return res.json({
						message: `Email has been sent to ${email}. Click to reset password`,
					});
				})
				.catch(error => {
					console.log('ses reset pwd failed ', error);
					return res.status(400).json({
						error: 'We could not verify your email. Try later',
					});
				});
		});
	});
};

exports.resetPassword = (req, res) => {
	const { resetPasswordLink, newPassword } = req.body;
	if (resetPasswordLink) {
		// check for expiry
		jwtToken.verify(
			resetPasswordLink,
			process.env.JWT_RESET_PASSWORD,
			(err, success) => {
				if (err) {
					return res.status(400).json({
						error: 'Expired link. Try again',
					});
				}

				User.findOne({ resetPasswordLink }).exec((error, user) => {
					if (error || !user) {
						return res.status(400).json({
							error: 'Invalid token. Try again',
						});
					}

					const updatedFields = {
						password: newPassword,
						resetPasswordLink: '',
					};

					user = _.extend(user, updatedFields);

					user.save((err, result) => {
						if (err) {
							return res.status(400).json({
								error: 'Password reset failed. Try again',
							});
						}

						res.json({
							message: 'Great! Now login with new password',
						});
					});
				});
			}
		);
	}
};
