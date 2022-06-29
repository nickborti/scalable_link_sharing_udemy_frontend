const express = require('express');
const router = express.Router();

// controllers
const { register } = require('../contollers/auth');

// validators
const { runValidation } = require('../validators');
const { userRegisterValidator } = require('../validators/auth');

router.post('/register', userRegisterValidator, runValidation, register);

module.exports = router;
