const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');

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
        res.status(400).json({
          error: 'We could not verify your email. Please try again',
        });
      });
  });
};

exports.activate = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'Expired link. Try again',
      });
    }

    const { name, email, password } = jwt.decode(token);
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
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};