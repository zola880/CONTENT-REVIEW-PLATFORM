// Middleware for validating request data using Joi schemas
const AppError = require('../utils/AppError');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false });
    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(messages, 400));
    }
    req[source] = value; // replace with validated value
    next();
  };
};

module.exports = validate;