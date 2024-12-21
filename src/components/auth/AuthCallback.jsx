import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { tokenStorage } from "../../lib/token";

function AuthCallback() {
    const navigate = useNavigate();
    const { loadUser } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const handleCallback = async () => {
            // Prevent double processing
            if (isProcessing) return;
            setIsProcessing(true);

            try {

                // Get token from URL
                const params = new URLSearchParams(window.location.search);
                let token = params.get("token");
                const error = params.get("error");


                if (error || !token) {
                    console.log(
                        "No token found in URL. Search params:",
                        params.toString(),
                    );
                    console.log("URL parts:", {
                        search: window.location.search,
                        hash: window.location.hash,
                        pathname: window.location.pathname,
                    });
                    throw new Error(error || "No token received");
                }

                // Clean and store token
                token = decodeURIComponent(token.split("#")[0].trim());
                if (!tokenStorage.set(token)) {
                    throw new Error("Invalid token format");
                }

                // Load user data before clearing URL
                await loadUser();

                // Clear the URL to prevent loops
                window.history.replaceState({}, document.title, "/");

                navigate("/", { replace: true });
            } catch (error) {
                console.error("Auth callback error:", error);
                console.log("Full error details:", {
                    message: error.message,
                    stack: error.stack,
                    response: error.response?.data,
                });
                tokenStorage.remove();

                // Clear URL even on error
                window.history.replaceState({}, document.title, "/");

                navigate("/auth?error=auth_failed", { replace: true });
            } finally {
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [navigate, loadUser, isProcessing]);

    // Show loading state
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold">
                    Processing login...
                </h2>
                <p className="text-muted-foreground">
                    Please wait while we complete your sign in.
                </p>
            </div>
        </div>
    );
}

export default AuthCallback;
