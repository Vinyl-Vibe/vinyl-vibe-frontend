import { Link, useLocation } from "react-router-dom";
import { Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardNav() {
    const location = useLocation();

    // Helper to determine if a path is active
    const isActivePath = (path) => {
        if (path === "/admin" && location.pathname === "/admin") return true;
        if (path !== "/admin" && location.pathname.startsWith(path))
            return true;
        return false;
    };

    return (
        <nav className="flex justify-between items-center space-x-4 lg:space-x-6">
            <div className="flex h-20 items-center space-x-4">
                <img src="/icon.png" alt="Logo" className="h-10 w-10 rounded-lg" />
                <Button
                    variant="link"
                    className={`text-sm font-medium ${
                        isActivePath("/admin") ? "underline" : ""
                    }`}
                    asChild
                >
                    <Link to="/admin">Dashboard</Link>
                </Button>
                <Button
                    variant="link"
                    className={`text-sm font-medium ${
                        isActivePath("/admin/orders") ? "underline" : ""
                    }`}
                    asChild
                >
                    <Link to="/admin/orders">Orders</Link>
                </Button>
                <Button
                    variant="link"
                    className={`text-sm font-medium ${
                        isActivePath("/admin/products") ? "underline" : ""
                    }`}
                    asChild
                >
                    <Link to="/admin/products">Products</Link>
                </Button>
                <Button
                    variant="link"
                    className={`text-sm font-medium ${
                        isActivePath("/admin/customers") ? "underline" : ""
                    }`}
                    asChild
                >
                    <Link to="/admin/customers">Customers</Link>
                </Button>
            </div>
            <div className="ml-auto flex items-center space-x-4">
                <Button
                    variant="secondary"
                    className="text-sm font-medium"
                    asChild
                >
                    <Link to="/">Return to Store</Link>
                </Button>
            </div>
        </nav>
    );
}
