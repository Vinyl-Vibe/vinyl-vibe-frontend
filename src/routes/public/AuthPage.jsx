import AuthNav from "@/components/layout/AuthNav";
import AuthForm from "@/components/auth/AuthForm";

function AuthPage() {
    return (
        <>
            <AuthNav />

            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="flex h-full w-full max-w-7xl items-center justify-center border-x p-6 pt-32">
                    <AuthForm />
                </div>
                <div className="flex w-full max-w-7xl items-center justify-center border p-6">
                    <div className="max-w-sm text-center text-[0.8rem] font-light text-muted-foreground">
                        By continuing, you agree to Vinyl Vibe's Terms of
                        Service and Privacy Policy, and to receiving periodic
                        emails with updates.
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthPage;
