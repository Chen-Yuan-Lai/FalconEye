class AppError extends Error {
  constructor(message, status) {
    super(message);

    this.statusCode = status;
    this.status = `${status}`.startsWith('4') ? 'fail' : 'error';

    // errors created ourselves are operational errors
    // some programming errors are not have this property
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
