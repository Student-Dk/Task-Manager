const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message
      }))
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Server error'
  });
};

module.exports = errorHandler;
