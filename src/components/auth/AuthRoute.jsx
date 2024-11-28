import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import PropTypes from 'prop-types'

/* 
  AuthRoute: Protects routes that require authentication
  - Redirects to login if user is not authenticated
  - Saves attempted route to redirect back after login
  - Renders protected content if authenticated
*/
function AuthRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Save the attempted route to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return children
}

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthRoute 