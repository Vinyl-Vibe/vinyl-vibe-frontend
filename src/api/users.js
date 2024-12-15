import api from "../lib/axios";

export const usersApi = {
    // Get current user's profile
    getCurrentUserProfile: async () => {
        const { data } = await api.get("/auth/me");
        return data.user;
    },

    // Update user's profile
    updateProfile: async (profileData) => {
        const { data } = await api.patch("/users/profile", {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
        });
        return data;
    },

    // Update user's address (through profile endpoint)
    updateAddress: async (addressData) => {
        const { data } = await api.patch("/users/profile", {
            address: {
                street: addressData.street,
                city: addressData.city,
                state: addressData.state,
                postalCode: addressData.postalCode,
                country: addressData.country,
            }
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
