import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { tokenStorage } from "../../lib/token";

function AuthCallback() {
    const navigate = useNavigate();
    const { loadUser } = useAuthStore();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get token from URL
                const params = new URLSearchParams(window.location.search);
                let token = params.get("token");
                const error = params.get("error");

                if (error || !token) {
                    throw new Error(error || "No token received");
                }

                // Clean and store token
                token = token.split("#")[0].trim();
                if (!tokenStorage.set(token)) {
                    throw new Error("Invalid token format");
                }

                // Clear the URL to prevent loops
                window.history.replaceState({}, document.title, '/');

                // Load user data and redirect
                await loadUser();
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Auth callback error:", error);
                tokenStorage.remove();
                
                // Clear URL even on error
                window.history.replaceState({}, document.title, '/');
                
                navigate("/auth?error=auth_failed", { replace: true });
            }
        };

        handleCallback();
    }, [navigate, loadUser]);

    // Show loading state
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold">Processing login...</h2>
                <p className="text-muted-foreground">Please wait while we complete your sign in.</p>
            </div>
        </div>
    );
}

export default AuthCallback;
