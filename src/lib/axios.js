import axios from 'axios'

/* 
  Create a pre-configured axios instance for our API calls.
  This gives us consistent config across the app and lets us:
  - Set a base URL so we don't repeat it everywhere
  - Add default headers
  - Handle auth token management
  - Handle auth errors globally
*/
const api = axios.create({
  // Get API URL from environment variables to support different environments
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/* 
  Request Interceptor: Runs before every API request
  This automatically adds the auth token to requests if it exists,
  saving us from manually adding it to every API call
*/
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* 
  Response Interceptor: Runs after every API response
  This handles authentication errors globally:
  - If the server returns a 401 (unauthorized), the token is invalid/expired
  - We clear the token and redirect to login
  - This prevents showing protected data when auth is invalid
*/
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api 