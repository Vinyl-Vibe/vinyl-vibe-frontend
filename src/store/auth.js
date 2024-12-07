import { create } from "zustand";
import { authApi } from "../api/auth";

/* 
    Auth Store using Zustand
    Manages global authentication state including:
    - Current user data
    - Loading states
    - Error handling
    - Authentication status
    - Admin status

    This centralised store lets components:
    - Access auth state without prop drilling
    - Trigger auth actions from anywhere
    - Stay in sync with auth status
*/
export const useAuthStore = create((set, get) => ({
	// Store state
	user: null, // Current user data
	isLoading: false, // Loading state for async operations
	error: null, // Last error message
	isAuthenticated: false, // Whether user is logged in
	isAdmin: false, // Whether user has admin privileges

	// Log in user with credentials
	login: async (credentials) => {
		set({ isLoading: true, error: null });
		try {
			const data = await authApi.login(credentials);
			
			// Store token for future API calls
			if (!data.token) {
				throw new Error('No token received from server');
			}
			localStorage.setItem("token", data.token);

			// Update store with user data and auth status
			set({
				user: data.user,
				isAuthenticated: true,
				isAdmin: data.user.role === 'admin',
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.response?.data?.message || "Login failed",
				isLoading: false,
			});
			throw error;
		}
	},

	// Log out user
	logout: async () => {
		set({ isLoading: true });
		try {
			await authApi.logout();
		} finally {
			// Always clear auth state, even if API call fails
			set({
				user: null,
				isAuthenticated: false,
				isAdmin: false,
				isLoading: false,
			});
		}
	},

	// Load user data using stored token
	// Called on app startup to restore auth state
	loadUser: async () => {
		// Skip if no token exists
		if (!localStorage.getItem("token")) return;

		set({ isLoading: true });
		try {
			const data = await authApi.getCurrentUser();
			set({
				user: data.user,
				isAuthenticated: true,
				isAdmin: data.user.role === 'admin',
				isLoading: false,
			});
		} catch (error) {
			// Clear auth state if token is invalid
			set({
				user: null,
				isAuthenticated: false,
				isAdmin: false,
				isLoading: false,
			});
		}
	},

	// Add register function
	register: async userData => {
		set({ isLoading: true, error: null })
		try {
			console.log('Register request:', userData);
			const data = await authApi.register({
				email: userData.email,
				password: userData.password,
				role: userData.isAdmin ? "admin" : "user"
			})
			console.log('Register response:', data);

			set({ 
				isLoading: false,
				error: null
			})
			return { success: true }

		} catch (error) {
			console.error('Register error:', error);
			set({ 
				error: error.response?.data?.message || 'Registration failed',
				isLoading: false 
			})
			throw error
		}
	},
}));
