const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams } = require('../helpers/email');

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
		const token = jwt.sign(
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
			.then((data) => {
				console.log('Email submitted to SES ', data);
				res.json({
					message: `Email has been sent to ${email}. Follow the instructions to complete your registration`,
				});
			})
			.catch((error) => {
				console.log('ses email on register error ', error);
				res.json({
					error: 'We could not verify your email. Please try again',
				});
			});
	});
};
