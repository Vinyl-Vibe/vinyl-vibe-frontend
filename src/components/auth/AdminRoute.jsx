import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import DashboardNav from '@/components/navigation/dashboard/DashboardNav'

/* 
    AdminRoute: Protects routes that require admin privileges
    - Redirects to home if user is not an admin
    - Shows 403 error if authenticated but not admin
    - Renders protected content if admin
*/
function AdminRoute() {
    const { isAuthenticated, isAdmin } = useAuthStore();

    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/auth" replace />;
    }

    // Render child routes
    return (
        <div className="flex min-h-screen w-full flex-col">
            <DashboardNav />
            <Outlet />
        </div>
    );
}

export default AdminRoute;
