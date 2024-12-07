import { useEffect } from "react";
import { useAuthStore } from "../../store/auth";

/* 
    AuthProvider: Manages authentication state on app load
    - Attempts to restore auth state using stored token
    - Shows loading state while checking auth
    - Renders children once auth check is complete
*/
function AuthProvider({ children }) {
	const { loadUser, isLoading } = useAuthStore();

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			loadUser();
		}
	}, [loadUser]);

	return children;
}

export default AuthProvider;
