import { useEffect } from 'react'
import { useAuthStore } from '../../store/auth'

/* 
  AuthProvider: Manages authentication state on app load
  - Attempts to restore auth state using stored token
  - Shows loading state while checking auth
  - Renders children once auth check is complete
*/
function AuthProvider({ children }) {
  const { loadUser, isLoading } = useAuthStore()

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div> // We'll replace this with a proper loading component later
  }

  return children
}

export default AuthProvider 