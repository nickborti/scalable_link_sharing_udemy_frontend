exports.registerEmailParams = (name, email, token) => {
	return {
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
};

exports.forgotPasswordEmailParams = (email, token) => {
	return {
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
                        <h3>Reset Password Link</h3>
                        <p style="color:red;">Please use the follow link to reset your password</p>
                        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                    </html>`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'Reset your password',
			},
		},
	};
};
