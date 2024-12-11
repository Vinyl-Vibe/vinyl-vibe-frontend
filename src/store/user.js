import { create } from "zustand";
import { usersApi } from "../api/users";

export const useUserStore = create((set) => ({
    profile: null,
    isLoading: false,
    error: null,

    // Load user profile
    loadProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await usersApi.getCurrentUserProfile();
            console.log("UserStore loadProfile data:", data);
            set({
                profile: data,
                isLoading: false,
            });
            // Store new token if provided
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
        } catch (error) {
            console.error("UserStore loadProfile error:", error);
            set({
                error:
                    error.response?.data?.message || "Failed to load profile",
                isLoading: false,
            });
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
            const data = await usersApi.updateProfile(profileData);
            set({
                profile: data,
                isLoading: false,
            });
        } catch (error) {
            set({
                error:
                    error.response?.data?.message || "Failed to update profile",
                isLoading: false,
            });
            throw error;
        }
    },

    // Clear profile data (used during logout)
    clearProfile: () => {
        set({
            profile: null,
            isLoading: false,
            error: null,
        });
    },
}));
