const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

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
		const params = {
			Source: process.env.EMAIL_FROM,
			Destination: {
				ToAddresses: [email],
			},
			ReplyToAddresses: [process.env.EMAIL_TO],
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: `
						<html>
							<h1>Hello ${name}</h1>
							<h3>Verify your email address</h3>
							<p style="color:red;">Please use the follow link to complete your registration</p>
							<p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
						</html>`,
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: 'Complete your registration',
				},
			},
		};

		const sendEmailOnRegister = ses.sendEmail(params).promise();

		sendEmailOnRegister
			.then((data) => {
				console.log('Email submitted to SES ', data);
				res.send('Email sent');
			})
			.catch((error) => {
				console.log('ses email on register error ', error);
				res.send('Email failed');
			});
	});
};
