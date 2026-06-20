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
// Utility class for standardizing API responses in the content review platform backend. Provides static methods to generate consistent response formats for successful operations, errors, and paginated results. The success method returns a standard success response with data and an optional message, while the error method returns a standardized error response with an error message and status code. The paginated method is used for endpoints that return paginated data, including pagination metadata such as current page, limit, total items, and total pages.