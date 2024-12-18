// utils/api-error.js

/**
 * Custom error class for handling API errors with status codes and additional details
 */
class ApiError extends Error {
	/**
   * Create an ApiError instance
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object} [errors] - Additional error details
   * @param {boolean} [isOperational=true] - Whether the error is operational or programming
   * @param {string} [stack] - Error stack trace
   */

	constructor(
		statusCode,
		message,
		errors = null,
		isOperational = true,
		stack = '',
	) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.errors = errors;

		// Determine error status based on status code
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

		// Add timestamp
		this.timestamp = new Date().toISOString();

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	/**
   * Create a BadRequest (400) error
   * @param {string} message - Error message
   * @param {Object} [errors] - Additional error details
   */
	static BadRequest(message, errors = null) {
		return new ApiError(400, message, errors);
	}

	/**
   * Create an Unauthorized (401) error
   * @param {string} message - Error message
   */
	static Unauthorized(message = 'Unauthorized') {
		return new ApiError(401, message);
	}

	/**
   * Create a Forbidden (403) error
   * @param {string} message - Error message
   */
	static Forbidden(message = 'Forbidden') {
		return new ApiError(403, message);
	}

	/**
   * Create a NotFound (404) error
   * @param {string} message - Error message
   */
	static NotFound(message = 'Resource not found') {
		return new ApiError(404, message);
	}

	/**
   * Create a Conflict (409) error
   * @param {string} message - Error message
   */
	static Conflict(message) {
		return new ApiError(409, message);
	}

	/**
   * Create a ValidationError (422) error
   * @param {string} message - Error message
   * @param {Object} errors - Validation errors
   */
	static ValidationError(message = 'Validation Error', errors) {
		return new ApiError(422, message, errors);
	}

	/**
   * Create an Internal Server Error (500)
   * @param {string} message - Error message
   * @param {boolean} [isOperational=false] - Whether the error is operational
   */
	static InternalError(
		message = 'Internal Server Error',
		isOperational = false,
	) {
		return new ApiError(500, message, null, isOperational);
	}

	/**
   * Check if error is an API error
   * @param {Error} error - Error to check
   * @returns {boolean}
   */
	static isApiError(error) {
		return error instanceof ApiError;
	}

	/**
   * Convert error to a structured response object
   * @returns {Object} Structured error response
   */
	toJSON() {
		return {
			status: this.status,
			statusCode: this.statusCode,
			message: this.message,
			...(this.errors && { errors: this.errors }),
			...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
			timestamp: this.timestamp,
		};
	}
}

// Middleware to handle API errors
const apiErrorHandler = (err, req, res, next) => {
	// If error isn't an ApiError, convert it
	if (!ApiError.isApiError(err)) {
		// Convert Sequelize validation errors
		if (err.name === 'SequelizeValidationError') {
			const errors = err.errors.reduce((acc, error) => {
				acc[error.path] = error.message;
				return acc;
			}, {});
			err = ApiError.ValidationError('Validation Error', errors);
		} else {
			// Convert other errors to Internal Server Error
			err = ApiError.InternalError(err.message);
		}
	}

	// Log error for debugging
	if (process.env.NODE_ENV === 'development') {
		console.error(err);
	}

	// Send error response
	res.status(err.statusCode).json(err.toJSON());
};

module.exports = {
	ApiError,
	apiErrorHandler,
};
