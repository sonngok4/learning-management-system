// utils/response.util.js
class ResponseUtil {
	static success(res, data = null, message = 'Success', statusCode = 200) {
		return res.status(statusCode).json({
			success: true,
			message,
			data,
		});
	}

	static error(res, message = 'Error', statusCode = 500, errors = null) {
		const response = {
			success: false,
			message,
		};

		if (errors) {
			response.errors = errors;
		}

		return res.status(statusCode).json(response);
	}

	static created(res, data = null, message = 'Resource created successfully') {
		return this.success(res, data, message, 201);
	}

	static badRequest(res, message = 'Bad request', errors = null) {
		return this.error(res, message, 400, errors);
	}

	static unauthorized(res, message = 'Unauthorized access') {
		return this.error(res, message, 401);
	}

	static forbidden(res, message = 'Forbidden access') {
		return this.error(res, message, 403);
	}

	static notFound(res, message = 'Resource not found') {
		return this.error(res, message, 404);
	}

	static conflict(res, message = 'Resource already exists') {
		return this.error(res, message, 409);
	}

	static paginate(res, data, page, limit, total) {
		return this.success(res, {
			items: data,
			pagination: {
				page: parseInt(page),
				limit: parseInt(limit),
				total,
				pages: Math.ceil(total / limit),
			},
		});
	}
}

module.exports = ResponseUtil;
