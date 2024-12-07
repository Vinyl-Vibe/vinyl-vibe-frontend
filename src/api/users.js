import api from "../lib/axios";

export const usersApi = {
  // Get current user's profile
  getCurrentUserProfile: async () => {
    // First get the current user's ID from the token
    const { data: authData } = await api.get('/auth/refresh');
    // Then get the full user profile using the ID
    const { data: userData } = await api.get(`/users/${authData.user.id}`);
    return userData;
  },

  // Update user's profile
  updateProfile: async (profileData) => {
    const { data } = await api.put(`/users/${profileData.userId}`, {
      profile: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address
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
    const { data } = await api.get('/users');
    return data;
  }
}; 