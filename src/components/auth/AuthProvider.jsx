import { useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import { useCartStore } from "../../store/cart";
import { tokenStorage } from "../../lib/token";

/* 
    AuthProvider: Manages authentication state on app load
    - Attempts to restore auth state using stored token
    - Shows loading state while checking auth
    - Initializes and syncs cart state
    - Renders children once auth check is complete
*/
function AuthProvider({ children }) {
    const { loadUser, isLoading: isLoadingAuth } = useAuthStore();
    const { initCart, isLoading: isLoadingCart } = useCartStore();

    // Initialize auth and cart on mount
    useEffect(() => {
        const init = async () => {
            if (tokenStorage.isValid()) {
                await loadUser();
            }
            await initCart();
        };

        init();
    }, [loadUser, initCart]);

    // Re-initialize cart when auth state changes
    useEffect(() => {
        const unsubscribe = useAuthStore.subscribe(
            (state, prevState) => {
                if (state.isAuthenticated !== prevState.isAuthenticated) {
                    initCart();
                }
            }
        );

        return () => unsubscribe();
    }, [initCart]);

    return children;
}

export default AuthProvider;
