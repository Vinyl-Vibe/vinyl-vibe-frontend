import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import PropTypes from "prop-types";
import { useEffect } from "react";

/* 
    AuthRoute: Protects routes that require authentication
    - Redirects to login if user is not authenticated
    - Saves attempted route to redirect back after login
    - Renders protected content if authenticated
    - Validates token on mount if one exists
    - Handles admin route protection
*/
function AuthRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin, validateToken } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        // Check if there's a token in localStorage and validate it
        const token = localStorage.getItem('token');
        if (token && !isAuthenticated) {
            validateToken();
        }
    }, [validateToken]);

    // If token exists but still validating, show nothing
    if (!isAuthenticated && localStorage.getItem('token')) {
        return null;
    }

    // Check for admin access if required
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (!isAuthenticated) {
        // Save the attempted route to redirect back after login
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}

AuthRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requireAdmin: PropTypes.bool,
};

export default AuthRoute;
