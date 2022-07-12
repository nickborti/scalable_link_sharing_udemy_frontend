const { check } = require('express-validator');

exports.userRegisterValidator = [
	check('name').not().isEmpty().withMessage('Name is required'),
	check('email').isEmail().withMessage('Must be a valid email'),
	check('password')
		.isLength({ min: 6 })
		.withMessage('Password must be atleast 6 chars'),
];

exports.userLoginValidator = [
	check('email').isEmail().withMessage('Must be a valid email'),
	check('password')
		.isLength({ min: 6 })
		.withMessage('Password must be atleast 6 chars'),
];

exports.forgotPasswordValidator = [
	check('email').isEmail().withMessage('Must be a valid email'),
];

exports.resetPasswordValidator = [
	check('newPassword')
		.isLength({ min: 6 })
		.withMessage('Password must be atleast 6 chars'),
	check('resetPasswordLink').not().isEmpty().withMessage('Token is required'),
];
