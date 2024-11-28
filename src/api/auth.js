import api from '../lib/axios'

/* 
  Auth API Module
  Centralizes all authentication-related API calls.
  This makes it easier to:
  - Maintain consistent auth endpoints
  - Update auth logic in one place
  - Mock auth calls for testing
*/
export const authApi = {
  // Authenticate user with credentials, returns user data and token
  login: async credentials => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  // Create new user account, returns user data and token
  register: async userData => {
    const { data } = await api.post('/auth/register', userData)
    return data
  },

  // Log out user and clear token
  // Even if API call fails, we still clear local token
  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  },

  // Get current user data using stored token
  // Used to restore auth state on page refresh
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me')
    return data
  }
} 