import { create } from "zustand";
import { authApi } from "../api/auth";
import { tokenStorage } from "../lib/token";
import { useCartStore } from './cart'

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

    // Validate token on refresh/mount
    validateToken: async () => {
        try {
            const token = tokenStorage.get()
            if (!token) {
                set({ isAuthenticated: false, isAdmin: false })
                return
            }

            // Get current user to validate token
            const response = await authApi.getCurrentUser()
            
            if (response.user) {
                set({ 
                    isAuthenticated: true,
                    isAdmin: response.user.role === 'admin',
                    user: response.user
                })
            } else {
                // Token is invalid
                tokenStorage.remove()
                set({ isAuthenticated: false, isAdmin: false })
            }
        } catch (error) {
            console.error('Token validation failed:', error)
            tokenStorage.remove()
            set({ isAuthenticated: false, isAdmin: false })
        }
    },

    // Log in user with credentials
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const data = await authApi.login(credentials);
            tokenStorage.set(data.token);
            
            // Set auth state first
            set({
                user: data.user,
                isAuthenticated: true,
                isAdmin: data.user.role === "admin",
                isLoading: false,
            });

            // Then sync cart
            await useCartStore.getState().syncCartOnLogin();
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
            tokenStorage.remove();
            // Clear cart on logout
            useCartStore.getState().clearCart()
            set({
                user: null,
                isAuthenticated: false,
                isAdmin: false,
                isLoading: false,
            });
        }
    },

    // Load user data using stored token
    // Called on app startup and after social login
    loadUser: async () => {
        if (!tokenStorage.isValid()) {
            console.log('loadUser: No valid token found');
            set({
                user: null,
                isAuthenticated: false,
                isAdmin: false,
                isLoading: false,
                error: null
            });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const { user } = await authApi.getCurrentUser();
            
            if (!user) {
                throw new Error('Invalid user data');
            }


            // Update all state in one set call
            set(state => ({
                ...state,
                user,
                isAuthenticated: true,
                isAdmin: user.role === "admin",
                isLoading: false,
                error: null
            }));

            return user;
        } catch (error) {
            console.error('loadUser error:', error);
            tokenStorage.remove();
            
            // Update all state in one set call
            set(state => ({
                ...state,
                user: null,
                isAuthenticated: false,
                isAdmin: false,
                isLoading: false,
                error: error.message || "Failed to load user data"
            }));
            
            throw error;
        }
    },

    // Add register function
    register: async userData => {
        set({ isLoading: true, error: null })
        try {
            const data = await authApi.register({
                email: userData.email,
                password: userData.password,
                role: "user"  // All new registrations are regular users
            })

            set({ 
                isLoading: false,
                error: null
            })
            return { success: true }
        } catch (error) {
            console.error("Register error:", error)
            set({
                error: error.response?.data?.message || "Registration failed",
                isLoading: false,
            })
            throw error
        }
    },

    // Request password reset
    requestPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.requestPasswordReset(email);
            set({ isLoading: false });
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to send reset email",
                isLoading: false,
            });
            throw error;
        }
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.resetPassword(token, newPassword);
            set({ isLoading: false });
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to reset password",
                isLoading: false,
            });
            throw error;
        }
    },
}));
