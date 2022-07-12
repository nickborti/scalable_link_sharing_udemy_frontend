const express = require('express');
const router = express.Router();

// controllers
const {
	register,
	activate,
	login,
	forgotPassword,
	resetPassword,
} = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const {
	userRegisterValidator,
	userLoginValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
} = require('../validators/auth');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', activate);
router.post('/login', userLoginValidator, runValidation, login);
router.put(
	'/forgot-password',
	forgotPasswordValidator,
	runValidation,
	forgotPassword
);
router.put(
	'/reset-password',
	resetPasswordValidator,
	runValidation,
	resetPassword
);

module.exports = router;
