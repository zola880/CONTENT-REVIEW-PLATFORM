const AuthService = require('../services/auth.service');
const { ApiResponse } = require('../utils/ApiResponse');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const validate = require('../middleware/validation.middleware');

// We'll use the validation middleware in routes, so controller doesn't need to validate again.

exports.register = async (req, res, next) => {
  try {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json(ApiResponse.success({ user, token }, 'Registration successful', 201));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.status(200).json(ApiResponse.success({ user, token }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};