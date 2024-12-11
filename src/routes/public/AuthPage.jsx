import AuthNav from "@/components/layout/AuthNav";
import AuthForm from "@/components/auth/AuthForm";

function AuthPage() {
    return (
        <>
            <AuthNav />

            <div className="flex h-full w-full items-center justify-center border-x p-6">
                <AuthForm />
            </div>
            <div className="flex w-full items-center justify-center border p-6">
                <div className="text-center text-[0.8rem] font-light text-muted-foreground max-w-sm">
                    By continuing, you agree to Vinyl Vibe's Terms of Service
                    and Privacy Policy, and to receiving periodic emails with
                    updates.
                </div>
            </div>
        </>
    );
}

export default AuthPage;
