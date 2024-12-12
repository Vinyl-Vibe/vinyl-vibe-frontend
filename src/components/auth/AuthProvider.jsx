import { useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import { tokenStorage } from "../../lib/token";

/* 
    AuthProvider: Manages authentication state on app load
    - Attempts to restore auth state using stored token
    - Shows loading state while checking auth
    - Renders children once auth check is complete
*/
function AuthProvider({ children }) {
    const { loadUser, isLoading } = useAuthStore();

    useEffect(() => {
        if (tokenStorage.isValid()) {
            loadUser();
        }
    }, [loadUser]);

    return children;
}

export default AuthProvider;
