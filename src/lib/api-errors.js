export class ApiError extends Error {
	// Custom error class for API errors
	// message: user-friendly error message
	// statusCode: HTTP status code
	// field: optional field name for validation errors
	constructor(message, statusCode, field) {
		super(message);
		this.statusCode = statusCode;
		this.field = field;
	}

	// Creates an ApiError instance from an axios error response
	// Extracts error details from response.data if available
	static fromResponse(error) {
		const { message, statusCode, field } = error.response?.data || {};
		return new ApiError(
			message || "An unexpected error occurred",
			statusCode || 500,
			field
		);
	}
}

// Converts any error into an ApiError instance
// Handles both API errors and unexpected errors
export const handleApiError = (error, defaultMessage = "An error occurred") => {
	if (error instanceof ApiError) {
		return error;
	}

	if (error.response) {
		return ApiError.fromResponse(error);
	}

	return new ApiError(defaultMessage, 500);
};
