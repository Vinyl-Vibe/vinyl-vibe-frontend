import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Package, Search, ArrowLeft, Store, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function DashboardNav() {
    const location = useLocation();
    const navigate = useNavigate();
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
            <div className="hidden h-20 items-center space-x-1 min-[465px]:flex sm:space-x-5">
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

            <div className="grid h-20 w-full grid-cols-3 items-center min-[465px]:hidden">
                <div>
                    <img
                        src="/icon.png"
                        alt="Logo"
                        className="h-10 w-10 rounded-lg"
                    />
                </div>
                <div className="flex justify-center">
                    <Select
                        value={location.pathname}
                        onValueChange={(value) => navigate(value)}
                    >
                        <SelectTrigger className="h-11 w-[125px] bg-white/60 border-border/80 focus-visible:border-border/80 focus:outline-none focus:border-border/80 focus:ring-none">
                            <SelectValue placeholder="Select page" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            <SelectItem value="/admin">Dashboard</SelectItem>
                            <SelectItem value="/admin/orders">
                                Orders
                            </SelectItem>
                            <SelectItem value="/admin/products">
                                Products
                            </SelectItem>
                            <SelectItem value="/admin/customers">
                                Customers
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end">
                    <Button variant="secondary" className="h-11 w-11" asChild>
                        <Link to="/">
                            <Undo2 className="h-4 w-4" strokeWidth={1.8} />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="ml-auto hidden items-center space-x-4 min-[465px]:flex">
                <Button
                    variant="secondary"
                    className={`h-11 text-sm font-medium ${
                        windowWidth < 800 ? "h-11 w-11" : ""
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
