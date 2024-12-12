import api from "../lib/axios";
import { tokenStorage } from "../lib/token";

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
        tokenStorage.remove();
    },

    // Get current user data using stored token
    // Used to restore auth state on page refresh
    getCurrentUser: async () => {
        console.log("getCurrentUser - Token:", tokenStorage.get());
        try {
            const { data } = await api.get("/auth/me");
            console.log("getCurrentUser Response:", data);
            return data;
        } catch (error) {
            console.error("getCurrentUser Error:", error.response?.data);
            throw error;
        }
    },

    // Remove or comment out refreshToken if not needed yet
    // refreshToken: async () => {
    //     const { data } = await api.get("/auth/refresh");
    //     if (data.token) {
    //         localStorage.setItem("token", data.token);
    //     }
    //     return data;
    // },

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
                email: email.trim(),
            });
            return data;
        } catch (error) {
            // Log the error for debugging
            console.error("Password reset request error:", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data,
                headers: error.response?.headers,
            });

            // If we get a specific error message from the server, use it
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw error;
        }
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        const { data } = await api.post("/auth/reset-password", {
            token,
            password: newPassword,
        });
        if (data.token) {
            tokenStorage.set(data.token);
        }
        return data;
    },
};
