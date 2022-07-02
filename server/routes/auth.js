const express = require('express');
const router = express.Router();

// controllers
const { register, activate, login } = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const {
  userRegisterValidator,
  userLoginValidator,
} = require('../validators/auth');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', activate);
router.post('/login', userLoginValidator, runValidation, login);

module.exports = router;
