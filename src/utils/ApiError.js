class ApiError extends Error {
	constructor(
		statusCode,
		message,
		isOperational = true,
		stack = '',
		validation = false,
	) {
		super(message);

		if (validation) {
			this.message = JSON.parse(message);
		}

		this.statusCode = statusCode;
		this.isOperational = isOperational;

		if (stack) {
		  this.stack = stack;
		} else {
		  Error.captureStackTrace(this);
		}
	}
}

export default ApiError;
