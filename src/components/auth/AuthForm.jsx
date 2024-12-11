import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2, CheckCircle2, TriangleAlert } from "lucide-react";

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
    const { login, register, error } = useAuthStore();
    const [formState, setFormState] = useState({
        isLoading: false,
        activeTab: "login",
        registrationSuccess: false,
        error: null,
    });

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

    const handleTabChange = (value) => {
        setFormState((prev) => ({
            ...prev,
            activeTab: value,
            isLoading: false, // Reset loading state on tab change
            registrationSuccess: false, // Reset success state on tab change
        }));
    };

    return (
        <Card className="mx-auto mt-20 w-[400px]">
            <CardHeader>
                <CardTitle>Welcome to Vinyl Vibe</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs
                    defaultValue="login"
                    value={formState.activeTab}
                    onValueChange={handleTabChange}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="login"
                            disabled={formState.isLoading}
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            disabled={formState.isLoading}
                        >
                            Register
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
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
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        disabled={formState.isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
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
                                    className="relative"
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

                    <TabsContent value="register">
                        <form onSubmit={handleRegister}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        disabled={formState.isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
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
                                    className="relative"
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
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default AuthForm;
