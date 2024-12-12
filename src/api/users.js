import api from "../lib/axios";

export const usersApi = {
    // Get current user's profile
    getCurrentUserProfile: async () => {
        const { data } = await api.get("/auth/me");
        return data.user;
    },

    // Update user's profile
    updateProfile: async (profileData) => {
        const { data } = await api.put(`/users/${profileData.userId}`, {
            profile: profileData
        });
        return data;
    },

    // Get user by ID (admin only)
    getUserById: async (userId) => {
        const { data } = await api.get(`/users/${userId}`);
        return data;
    },

    // Get all users (admin only)
    getAllUsers: async () => {
        const { data } = await api.get("/users");
        return data;
    },
};
