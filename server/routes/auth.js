const express = require('express');
const router = express.Router();

// controllers
const { register, activate } = require('../contollers/auth');

// validators
const { runValidation } = require('../validators');
const { userRegisterValidator } = require('../validators/auth');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', activate);

module.exports = router;
