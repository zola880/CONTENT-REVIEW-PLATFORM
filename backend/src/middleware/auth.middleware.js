const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { jwtSecret } = require('../config/env');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = authMiddleware;