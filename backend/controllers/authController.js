const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const env = require('../config/env');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return false;
  }

  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  });

  return true;
};

exports.register = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) {
      return;
    }

    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) {
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUser(user)
    });
  } catch (error) {
    return next(error);
  }
};
