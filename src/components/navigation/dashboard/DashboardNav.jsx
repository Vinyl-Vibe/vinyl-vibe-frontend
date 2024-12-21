import { Link, useLocation } from "react-router-dom";
import { LogOut, Package, Search, ArrowLeft, Store, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function DashboardNav() {
    const location = useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Helper to determine if a path is active
    const isActivePath = (path) => {
        if (path === "/admin" && location.pathname === "/admin") return true;
        if (path !== "/admin" && location.pathname.startsWith(path))
            return true;
        return false;
    };

    return (
        <nav className="flex items-center justify-between px-4">
            <div className="flex h-20 items-center space-x-1 sm:space-x-5">
                <img
                    src="/icon.png"
                    alt="Logo"
                    className="h-10 w-10 rounded-lg"
                />
                <Button
                    variant="link"
                    size="sm"
                    className={`text-sm font-medium ${
                        isActivePath("/admin") ? "underline" : ""
                    }`}
                    asChild
                >
                    <Link to="/admin">Dashboard</Link>
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    className={`text-sm font-medium ${
                        isActivePath("/admin/orders") ? "underline" : ""
                    }`}
                    asChild
                >
                    <Link to="/admin/orders">Orders</Link>
                </Button>
                <Button
                    variant="link"
                    size="sm"
                    className={`text-sm font-medium ${
                        isActivePath("/admin/products") ? "underline" : ""
                    }`}
                    asChild
                >
                    <Link to="/admin/products">Products</Link>
                </Button>
                <Button
                    variant="link"
                    size="sm"
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
                    className={`text-sm font-medium h-11 ${
                        windowWidth < 800 ? "w-11 h-11" : ""
                    }`}
                    asChild
                >
                    <Link to="/">
                        {windowWidth < 800 ? (
                            <Undo2 className="h-4 w-4" strokeWidth={1.8} />
                        ) : (
                            "Return to store"
                        )}
                    </Link>
                </Button>
            </div>
        </nav>
    );
}
