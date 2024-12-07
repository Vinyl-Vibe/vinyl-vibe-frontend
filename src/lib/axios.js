import axios from "axios";

/* 
    Create a pre-configured axios instance for our API calls.
    This gives us consistent config across the app and lets us:
    - Set a base URL so we don't repeat it everywhere
    - Add default headers
    - Handle auth token management
    - Handle auth errors globally
*/
const api = axios.create({
	// Get API URL from environment variables to support different environments
	baseURL: "https://api.vinylvibe.live",
	headers: {
		"Content-Type": "application/json",
	},
});

/* 
    Request Interceptor: Runs before every API request
    This automatically adds the auth token to requests if it exists,
    saving us from manually adding it to every API call
*/
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

/* 
    Response Interceptor: Runs after every API response
    This handles authentication errors globally:
    - If the server returns a 401 (unauthorized), try to refresh the token
    - If refresh fails, clear auth and redirect to login
*/
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Try to refresh the token
			try {
				const { data } = await api.get("/auth/refresh");
				if (data.token) {
					localStorage.setItem("token", data.token);
				}
				
				// Retry the original request with new token
				const config = error.config;
				config.headers.Authorization = `Bearer ${data.token}`;
				return api(config);
			} catch (refreshError) {
				localStorage.removeItem("token");
				window.location.href = "/auth";
			}
		}
		return Promise.reject(error);
	}
);

export default api;
