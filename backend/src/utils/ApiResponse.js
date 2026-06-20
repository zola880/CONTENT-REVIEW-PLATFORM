class ApiResponse {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  static error(message, statusCode = 400, stack = null) {
    const response = {
      success: false,
      error: {
        message,
        statusCode,
      },
    };
    if (stack && process.env.NODE_ENV !== 'production') {
      response.error.stack = stack;
    }
    return response;
  }

  static paginated(data, page, limit, total, message = 'Success') {
    return {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = { ApiResponse };