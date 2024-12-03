import { useState, useCallback } from "react";
import { handleApiError } from "../lib/api-errors";

// Custom hook for making API calls with loading and error states
// apiCall: async function that makes the actual API request
// Returns:
// - execute: function to call the API
// - isLoading: boolean indicating if request is in progress
// - error: null or ApiError instance if request failed
export function useApi(apiCall) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const execute = useCallback(
		async (...args) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await apiCall(...args);
				return result;
			} catch (err) {
				const apiError = handleApiError(err);
				setError(apiError);
				throw apiError;
			} finally {
				setIsLoading(false);
			}
		},
		[apiCall]
	);

	return {
		execute,
		isLoading,
		error,
	};
}
