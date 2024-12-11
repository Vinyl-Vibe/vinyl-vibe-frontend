import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";
import { useProductStore } from "../../store/products";
import VinylVibeLogo from "@/assets/icons/vinyl_vibe-logo";
import { Button } from "../ui/button";
import { LibraryIcon, SearchIcon, ShoppingCart, User } from "lucide-react";
import { Input } from "../ui/input";

function AuthNav({ children }) {
    const { isAuthenticated, isAdmin } = useAuthStore();
    const { profile } = useUserStore();
    console.log("MainNav profile:", profile);
    const { resetFilters, refreshProducts } = useProductStore();
    const location = useLocation();

    const handleCatalogClick = () => {
        resetFilters();
        refreshProducts();
    };

    const isCatalogPage = location.pathname === "/catalog";

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 flex justify-center px-10">
            <div className="z-51 h-20 w-full max-w-7xl border bg-background/70 px-6 backdrop-blur-[8px]">
                <div className="flex h-full justify-center">
                    <div className="flex">
                        <Link to="/" className="flex items-center pr-6">
                            <VinylVibeLogo
                                fill="hsl(var(--foreground))"
                                secondaryfill="hsl(var(--border))"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AuthNav;
