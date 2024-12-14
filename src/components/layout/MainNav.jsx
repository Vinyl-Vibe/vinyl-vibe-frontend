import { memo, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";
import { useProductStore } from "../../store/products";
import VinylVibeLogo from "@/assets/icons/vinyl_vibe-logo";
import { Button } from "../ui/button";
import {
    LibraryIcon,
    SearchIcon,
    ShoppingCart,
    Search,
    Settings,
    LogOut,
    MapPin,
    Package,
    Sun,
    Moon,
    Laptop,
} from "lucide-react";
import { Input } from "../ui/input";
import CartSheet from "../cart/CartSheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountDialog } from "./EditProfile";
import { useTheme } from "@/components/theme/theme-provider";

function MainNav() {
    const { isAuthenticated, isAdmin } = useAuthStore();
    const { profile } = useUserStore();
    const { resetFilters, refreshProducts } = useProductStore() || {};
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef(null);
    const searchWrapperRef = useRef(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { setTheme } = useTheme();

    // Memoize the navigation items to prevent unnecessary re-renders
    const isActive = (path) => location.pathname === path;

    const handleCatalogClick = () => {
        if (typeof resetFilters === "function") {
            resetFilters();
        }
        if (typeof refreshProducts === "function") {
            refreshProducts();
        }
    };

    const toggleSearch = () => {
        setIsSearchOpen((prev) => {
            const newState = !prev;
            if (newState && searchInputRef.current) {
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 300);
            }
            return newState;
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setIsSearchOpen(false);
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(""); // Clear search after submission
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                isSearchOpen &&
                searchWrapperRef.current &&
                !searchWrapperRef.current.contains(event.target) &&
                !event.target.closest('button[data-search-toggle]')
            ) {
                setIsSearchOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 flex flex-col justify-center px-10">
            <div className="z-51 h-20 w-full max-w-7xl border bg-background/70 px-6 backdrop-blur-[8px]">
                <div className="flex h-full justify-between">
                    <div className="flex">
                        <Link
                            to="/"
                            className="flex items-center border-r pr-6"
                        >
                            <VinylVibeLogo
                                fill="hsl(var(--foreground))"
                                secondaryfill="hsl(var(--border))"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex h-full items-center space-x-3 border-l pl-6">
                            <Button
                                size="icon"
                                variant={isSearchOpen ? "secondary" : ""}
                                onClick={toggleSearch}
                                className="relative"
                                data-search-toggle
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                            <Link
                                to="/catalog"
                                className="text-sm font-medium"
                                onClick={handleCatalogClick}
                            >
                                <Button
                                    size="icon"
                                    variant={
                                        isActive("/catalog") ? "secondary" : ""
                                    }
                                >
                                    <LibraryIcon />
                                </Button>
                            </Link>
                            <CartSheet />
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span className="hidden md:inline-block">
                                                {profile?.email || "My Account"}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => document.getElementById('edit-profile-trigger')?.click()}>
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Edit Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => document.getElementById('edit-address-trigger')?.click()}>
                                                <MapPin className="mr-2 h-4 w-4" />
                                                <span>Edit Address</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/orders">
                                                    <Package className="mr-2 h-4 w-4" />
                                                    <span>Past Orders</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Theme</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                                <Sun className="mr-2 h-4 w-4" />
                                                <span>Light</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                                <Moon className="mr-2 h-4 w-4" />
                                                <span>Dark</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                                <Laptop className="mr-2 h-4 w-4" />
                                                <span>System</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            className="text-red-600 focus:text-red-600"
                                            onClick={() => logout()}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="text-sm font-medium"
                                >
                                    <Button size="icon" variant="">
                                        <User />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-center overflow-hidden">
                <form onSubmit={handleSearch} className="w-full">
                    <div
                        ref={searchWrapperRef}
                        className={`relative flex h-16 w-full max-w-7xl items-center border border-t-0 bg-white/90 backdrop-blur-[8px] transition-transform duration-300 ${
                            isSearchOpen ? "translate-y-0" : "-translate-y-16"
                        }`}
                    >
                        <Search className="absolute left-7 z-10 h-5 w-5 text-foreground" />
                        <Input
                            ref={searchInputRef}
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Vinyl Vibe"
                            className="h-full rounded-none border-none bg-transparent pl-14 pr-6 text-2xl tracking-tight shadow-none placeholder:text-2xl placeholder:text-muted-foreground/50"
                        />
                    </div>
                </form>
            </div>

            {/* Hidden dialogs that can be triggered from dropdown */}
            <div className="hidden">
                <AccountDialog type="profile" id="edit-profile-trigger" />
                <AccountDialog type="address" id="edit-address-trigger" />
            </div>
        </nav>
    );
}

// Memoize the entire component
export default memo(MainNav);
