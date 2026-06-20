const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const AppError = require('../utils/AppError');

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
  }

  static async register(userData) {
    const { email, password, name } = userData;
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }
    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({ email, password, name });
    const token = this.generateToken(user._id);
    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    return { user: userObj, token };
  }

  static async login(email, password) {
    // Find user by email, include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }
    const token = this.generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;
    return { user: userObj, token };
  }
}

module.exports = AuthService;