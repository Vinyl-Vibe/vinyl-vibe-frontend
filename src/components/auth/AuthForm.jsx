import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, CheckCircle2, TriangleAlert } from "lucide-react";
import { Separator } from "../ui/separator";

/* 
    AuthForm: Combined login/register form with tab navigation
    - Handles both login and registration
    - Shows validation errors
    - Redirects after successful auth
    - Preserves attempted route for redirect after login
*/
function AuthForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, requestPasswordReset, resetPassword, error } = useAuthStore();
    const [formState, setFormState] = useState({
        isLoading: false,
        activeTab: "login",
        registrationSuccess: false,
        resetEmailSent: false,
        resetSuccess: false,
        error: null,
    });

    // Get reset token from URL if present
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('token');

    // If reset token is present, show reset password tab
    useEffect(() => {
        if (resetToken) {
            handleTabChange('reset-password');
        }
    }, [resetToken]);

    // Get redirect path from location state, default to home
    const from = location.state?.from?.pathname || "/";

    async function handleLogin(e) {
        e.preventDefault();
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        const formData = new FormData(e.target);
        const credentials = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            await login(credentials);
            // Success - redirect handled by auth store
            navigate(from, { replace: true });
        } catch (err) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                error: err.response?.data?.message || "Login failed",
            }));
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        const formData = new FormData(e.target);
        try {
            await register({
                email: formData.get("email"),
                password: formData.get("password"),
            });

            // Immediately switch to login tab and show success message
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                registrationSuccess: true,
                error: null,
                activeTab: "login", // Switch to login tab immediately
            }));

            // Clear success message after delay
            setTimeout(() => {
                setFormState((prev) => ({
                    ...prev,
                    registrationSuccess: false,
                }));
            }, 3000);
        } catch (err) {
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                error: err.message || "Registration failed",
            }));
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        const formData = new FormData(e.target);
        try {
            await requestPasswordReset(formData.get("email"));
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                resetEmailSent: true,
                error: null,
            }));
        } catch (err) {
            console.error('Forgot password error:', err);
            let errorMessage = "Failed to send reset email";
            
            // Handle specific error cases
            if (err.response?.status === 500) {
                errorMessage = "Server error. Please try again later.";
            } else if (err.message.includes('Too many attempts')) {
                errorMessage = err.message; // Use the specific wait time message
            } else if (err.response?.status === 400) {
                errorMessage = err.response.data?.message || "Invalid email address";
            }
            
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
                resetEmailSent: false // Reset this in case of error
            }));
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        const formData = new FormData(e.target);
        try {
            const data = await resetPassword(resetToken, formData.get("password"));
            // If we got a new auth token, we're logged in
            if (data.token) {
                navigate(from, { replace: true });
            } else {
                setFormState((prev) => ({
                    ...prev,
                    isLoading: false,
                    resetSuccess: true,
                    error: null,
                    activeTab: "login"
                }));
            }
        } catch (err) {
            let errorMessage = "Failed to reset password";
            if (err.response?.status === 401) {
                errorMessage = "Reset link has expired. Please request a new one.";
            } else if (err.response?.status === 400) {
                errorMessage = "Password must be at least 8 characters long";
            }
            setFormState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
        }
    }

    const handleTabChange = (value) => {
        setFormState((prev) => ({
            ...prev,
            activeTab: value,
            isLoading: false, // Reset loading state on tab change
            registrationSuccess: false, // Reset success state on tab change
        }));
    };

    return (
        <Card className="w-[400px] border-0 bg-transparent shadow-none">
            <CardHeader className="pb-8">
                <CardTitle className="text-3xl font-medium">
                    {formState.activeTab === "login"
                        ? "Welcome back"
                        : formState.activeTab === "register"
                        ? "Create an account"
                        : formState.activeTab === "forgot-password"
                        ? "Forgotten password"
                        : "Set new password"}
                </CardTitle>
                <CardDescription className="text-base">
                    {formState.activeTab === "login"
                        ? "Login to your account to continue."
                        : formState.activeTab === "register"
                        ? "Sign up for an account to get started."
                        : formState.activeTab === "forgot-password"
                        ? "Request a password reset link below."
                        : "Enter your new password below."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs
                    defaultValue="login"
                    value={formState.activeTab}
                    onValueChange={handleTabChange}
                >
                    <TabsContent
                        value="login"
                        className="transition-opacity duration-200 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0"
                    >
                        <form onSubmit={handleLogin}>
                            <div className="grid gap-4">
                                {formState.registrationSuccess && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800">
                                            Success!
                                        </AlertTitle>
                                        <AlertDescription className="text-green-700">
                                            Account created successfully! Please
                                            log in with your new account.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <div className="mb-2 grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        className="h-12 rounded-xl"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        disabled={formState.isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex h-[14px] items-center justify-between">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleTabChange('forgot-password')
                                            }}
                                            className="text-sm text-muted-foreground hover:text-primary hover:underline"
                                            disabled={formState.isLoading}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <Input
                                        className="h-12 rounded-xl"
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        disabled={formState.isLoading}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={formState.isLoading}
                                    className="text-md relative mt-5 h-12"
                                >
                                    {formState.isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {formState.isLoading
                                        ? "Logging in..."
                                        : "Login"}
                                </Button>

                                {formState.error && (
                                    <Alert
                                        variant="destructive"
                                        className="mt-2"
                                    >
                                        <TriangleAlert className="h-4 w-4" />
                                        <AlertDescription>
                                            {formState.error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent
                        value="register"
                        className="transition-opacity duration-200 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0"
                    >
                        <form onSubmit={handleRegister}>
                            <div className="grid gap-4">
                                <div className="mb-2 grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        className="h-12 rounded-xl"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        disabled={formState.isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                    </div>
                                    <Input
                                        className="h-12 rounded-xl"
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        disabled={formState.isLoading}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={formState.isLoading}
                                    className="text-md relative mt-5 h-12"
                                >
                                    {formState.isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {formState.isLoading
                                        ? "Creating Account..."
                                        : "Register"}
                                </Button>

                                {formState.error && (
                                    <Alert
                                        variant="destructive"
                                        className="mt-2"
                                    >
                                        <TriangleAlert className="h-4 w-4" />
                                        <AlertDescription>
                                            {formState.error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </form>
                    </TabsContent>

                    {/* Forgot Password Tab */}
                    <TabsContent
                        value="forgot-password"
                        className="transition-opacity duration-200 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0"
                    >
                        <form onSubmit={handleForgotPassword}>
                            <div className="grid gap-4">
                                {formState.resetEmailSent ? (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800">
                                            Check your email
                                        </AlertTitle>
                                        <AlertDescription className="text-green-700">
                                            If an account exists with this email, you will receive password reset instructions.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        <div className="mb-2 grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                required
                                                disabled={formState.isLoading}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={formState.isLoading}
                                            className="text-md relative mt-5 h-12"
                                        >
                                            {formState.isLoading && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            {formState.isLoading
                                                ? "Sending..."
                                                : "Send Reset Link"}
                                        </Button>
                                    </>
                                )}

                                {formState.error && (
                                    <Alert variant="destructive" className="mt-2">
                                        <TriangleAlert className="h-4 w-4" />
                                        <AlertDescription>
                                            {formState.error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </form>
                    </TabsContent>

                    {/* Reset Password Tab */}
                    <TabsContent
                        value="reset-password"
                        className="transition-opacity duration-200 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0"
                    >
                        <form onSubmit={handleResetPassword}>
                            <div className="grid gap-4">
                                {formState.resetSuccess ? (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800">
                                            Password Reset Successful
                                        </AlertTitle>
                                        <AlertDescription className="text-green-700">
                                            Your password has been reset. You can now log in with your new password.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        <div className="mb-2 grid gap-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                disabled={formState.isLoading}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={formState.isLoading}
                                            className="text-md relative mt-5 h-12"
                                        >
                                            {formState.isLoading && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            {formState.isLoading
                                                ? "Resetting Password..."
                                                : "Reset Password"}
                                        </Button>
                                    </>
                                )}

                                {formState.error && (
                                    <Alert variant="destructive" className="mt-2">
                                        <TriangleAlert className="h-4 w-4" />
                                        <AlertDescription>
                                            {formState.error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </form>
                    </TabsContent>

                    <div className="mt-4 text-center text-sm">
                        <button
                            type="button"
                            onClick={() =>
                                handleTabChange(
                                    formState.activeTab === "login"
                                        ? "register"
                                        : "login",
                                )
                            }
                            className="text-primary hover:underline"
                            disabled={formState.isLoading}
                        >
                            {formState.activeTab === "login"
                                ? "Don't have an account? Sign up now"
                                : "Have an account? Sign in now"}
                        </button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default AuthForm;
