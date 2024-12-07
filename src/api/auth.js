import api from "../lib/axios";

/* 
    Auth API Module
    Centralises all authentication-related API calls.
    This makes it easier to:
    - Maintain consistent auth endpoints
    - Update auth logic in one place
    - Mock auth calls for testing
*/
export const authApi = {
	// Authenticate user with credentials, returns user data and token
	login: async (credentials) => {
		const { data } = await api.post("/auth/login", {
			email: credentials.email,
			password: credentials.password
		});
		return data;
	},

	// Create new user account, returns user data and token
	register: async (userData) => {
		const { data } = await api.post("/auth/register", {
			email: userData.email,
			password: userData.password,
			firstName: userData.firstName,
			lastName: userData.lastName,
			phoneNumber: userData.phoneNumber,
			address: {
				street: userData.street,
				city: userData.city,
				state: userData.state,
				postalCode: userData.postalCode,
				country: userData.country
			}
		});
		return data;
	},

	// Log out user and clear token
	// Even if API call fails, we still clear local token
	logout: async () => {
		await api.post("/auth/logout");
		localStorage.removeItem("token");
	},

	// Get current user data using stored token
	// Used to restore auth state on page refresh
	getCurrentUser: async () => {
		const { data } = await api.get("/auth/refresh");
		localStorage.setItem("token", data.accessToken);
		return data;
	},

	// Add refresh token endpoint
	refreshToken: async () => {
		const { data } = await api.get("/auth/refresh");
		return data;
	}
};
