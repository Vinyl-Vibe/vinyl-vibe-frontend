import { useEffect, useCallback } from "react";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";

function UserProvider({ children }) {
    const { isAuthenticated, user } = useAuthStore();
    const { loadProfile, clearProfile } = useUserStore();

    // Memoize the profile loading function
    const handleProfileUpdate = useCallback(async () => {
        if (isAuthenticated && user) {
            try {
                await loadProfile();
            } catch (error) {
                // Log but don't throw - we don't want to break the app
                console.error("Failed to load user profile:", error);
            }
        } else {
            clearProfile();
        }
    }, [isAuthenticated, user, loadProfile, clearProfile]);

    useEffect(() => {
        handleProfileUpdate();
    }, [handleProfileUpdate]);

    return children;
}

export default UserProvider;
