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
            const userData = await usersApi.getCurrentUserProfile();
            set({
                profile: userData,
                isLoading: false,
                error: null
            });
        } catch (error) {
            console.error("UserStore loadProfile error:", error);
            // Don't throw, just update state
            set({
                profile: null,
                error: error.response?.data?.message || "Failed to load profile",
                isLoading: false
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
                error: error.response?.data?.message || "Failed to update profile",
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
