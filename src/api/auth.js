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
            password: credentials.password,
        });
        return data;
    },

    // Create new user account, returns user data and token
    register: async (userData) => {
        const { data } = await api.post("/auth/register", {
            email: userData.email,
            password: userData.password,
            role: userData.role,
            onRequest: (config) => {
                console.log("Registration payload:", config.data);
                return config;
            },
        });
        console.log("Registration response:", data);
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
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        return data;
    },

    // Add refresh token endpoint
    refreshToken: async () => {
        const { data } = await api.get("/auth/refresh");
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        return data;
    },

    // Add method to update user profile
    updateProfile: async (profileData) => {
        const { data } = await api.put(`/users/${profileData.userId}`, {
            profile: {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
            },
        });
        return data;
    },

    // Request password reset email
    requestPasswordReset: async (email) => {
        try {
            const { data } = await api.post("/auth/forgot-password", { 
                email: email.trim()
            });
            return data;
        } catch (error) {
            // Log the error for debugging
            console.error('Password reset request error:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data,
                headers: error.response?.headers
            });

            // Handle rate limiting specifically
            if (error.response?.headers['x-ratelimit-remaining'] === '0') {
                const resetTime = error.response?.headers['x-ratelimit-reset'];
                const waitMinutes = Math.ceil((resetTime - Date.now() / 1000) / 60);
                throw new Error(
                    `Too many attempts. Please wait ${waitMinutes} minutes before trying again.`
                );
            }

            throw error;
        }
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        const { data } = await api.post("/auth/reset-password", {
            token,
            password: newPassword
        });
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        return data;
    },
};
