import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import PropTypes from "prop-types";

/* 
    AdminRoute: Protects routes that require admin privileges
    - Redirects to home if user is not an admin
    - Shows 403 error if authenticated but not admin
    - Renders protected content if admin
*/
function AdminRoute({ children }) {
	const { isAuthenticated, isAdmin } = useAuthStore();

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	// Show forbidden error if authenticated but not admin
	if (!isAdmin) {
		return <Navigate to="/403" replace />;
	}

	return children;
}

AdminRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AdminRoute;
