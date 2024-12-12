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

                await loadUser();
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Auth callback error:", error);
                tokenStorage.remove();
                navigate("/auth?error=auth_failed", { replace: true });
            }
        };

        handleCallback();
    }, [navigate, loadUser]);

    return null;
}

export default AuthCallback;
