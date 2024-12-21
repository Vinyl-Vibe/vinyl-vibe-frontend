import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetDescription,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import {
    Loader2,
    ShoppingCart,
    ShoppingBag,
    X,
    Menu,
    LibraryIcon,
    User,
    ArrowUpRight,
    ArrowRight,
    ArrowBigRight,
    MoveRight,
    Box,
    LogOut,
    MapPin,
    Settings,
} from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { Separator } from "../../ui/separator";
import { useCartStore } from "../../../store/cart";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Badge } from "../../ui/badge";
import { useAuthStore } from "../../../store/auth";
import { useUserStore } from "../../../store/user";
import { format } from "date-fns";

import NumberFlow from "@number-flow/react";

function MenuSheet() {
    const { items = [], isLoading } = useCartStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, isAdmin, logout, user } = useAuthStore();
    const { profile } = useUserStore();

    // Calculate totals with safety checks
    const subtotal = Array.isArray(items)
        ? items.reduce((total, item) => {
              return (
                  total + (item?.product?.price || 0) * (item?.quantity || 0)
              );
          }, 0)
        : 0;

    const itemCount = Array.isArray(items)
        ? items.reduce((total, item) => total + (item?.quantity || 0), 0)
        : 0;

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const handleShopNowClick = () => {
        // If not already on catalog page, navigate
        if (location.pathname !== "/catalog") {
            navigate("/catalog");
        }
    };

    const handleEditProfile = () => {
        document.getElementById("edit-profile-trigger")?.click();
    };

    const handleEditAddress = () => {
        document.getElementById("edit-address-trigger")?.click();
    };

    const handlePastOrders = () => {
        navigate("/orders");
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleAdminDashboard = () => {
        navigate("/admin");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="" className="relative" size="icon">
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex max-h-dvh w-[30rem] max-w-full flex-col justify-between gap-0 space-y-0 bg-accent p-0">
                <SheetTitle className="hidden">Menu</SheetTitle>
                <SheetDescription className="hidden">Main menu</SheetDescription>
                <SheetHeader className="flex flex-col px-0">
                    <div className="flex h-20 w-full flex-row items-center justify-between px-6">
                        {isAuthenticated ? (
                            <div className="flex flex-row items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground bg-secondary/50">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    {profile?.profile?.firstName ? (
                                        <>
                                            <div className="text-sm font-medium">
                                                {profile.profile.lastName
                                                    ? `${profile.profile.firstName} ${profile.profile.lastName}`
                                                    : profile.profile.firstName}
                                            </div>
                                            <div className="text-sm opacity-50">
                                                {profile.email}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-sm font-medium">
                                                {profile?.email}
                                            </div>
                                            <div className="text-sm opacity-50">
                                                {user?.createdAt
                                                    ? `Joined ${format(new Date(user.createdAt), "MMMM yyyy")}`
                                                    : "New user"}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <Link to="/auth" className="text-sm font-medium">
                                <Button
                                    variant="secondary"
                                    className="transition-colors-opacity flex items-center gap-2 border border-foreground text-base text-foreground duration-200 hover:bg-secondary/50"
                                >
                                    <User className="h-5 w-5" />
                                    Sign in
                                </Button>
                            </Link>
                        )}
                        <SheetClose>
                            <div className="transition-colors-opacity flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-foreground text-foreground duration-200 hover:bg-secondary/50">
                                <X className="h-5 w-5" />
                            </div>
                        </SheetClose>
                    </div>
                    {isAuthenticated && (
                        <div className="flex w-full flex-wrap items-center gap-2 border-t border-foreground px-6 py-4">
                            <SheetClose asChild>
                                <Button
                                    onClick={handleEditProfile}
                                    size=""
                                    className="rounded-full border-[#99DE1F] bg-[#B9F05A] [&_svg]:size-4"
                                >
                                    <Settings />
                                    Edit profile
                                </Button>
                            </SheetClose>

                            <SheetClose asChild>
                                <Button
                                    onClick={handlePastOrders}
                                    size=""
                                    className="rounded-full border-[#99DE1F] bg-[#B9F05A] [&_svg]:size-4"
                                >
                                    <Box />
                                    Past orders
                                </Button>
                            </SheetClose>

                            <SheetClose asChild>
                                <Button
                                    onClick={handleLogout}
                                    size=""
                                    className="rounded-full border-[#99DE1F] bg-[#B9F05A] hover:border-destructive hover:bg-destructive/10 hover:text-destructive [&_svg]:size-4"
                                >
                                    <LogOut />
                                    Log out
                                </Button>
                            </SheetClose>

                            {isAdmin && (
                                <SheetClose asChild>
                                    <Button
                                        onClick={handleAdminDashboard}
                                        size=""
                                        className="rounded-full border-[#99DE1F] bg-[#B9F05A] [&_svg]:size-4"
                                    >
                                        <Settings />
                                        Admin Dashboard
                                    </Button>
                                </SheetClose>
                            )}
                        </div>
                    )}
                </SheetHeader>
                <ScrollArea className="text-4xl font-normal tracking-[-0.1rem]">
                    <SheetClose asChild>
                        <Link
                            to="/products"
                            className="group flex h-20 flex-row items-center justify-between border-t border-foreground bg-secondary/0 px-7 transition-colors duration-200 hover:bg-secondary/30"
                        >
                            <div className="">All products</div>
                            <MoveRight strokeWidth={1} height={40} width={40} />
                        </Link>
                    </SheetClose>

                    <SheetClose asChild>
                        <Link
                            to="/products/vinyls"
                            className="group flex h-20 flex-row items-center justify-between border-t border-foreground bg-secondary/0 px-7 transition-colors duration-200 hover:bg-secondary/30"
                        >
                            <div className="">Vinyls</div>
                            <MoveRight strokeWidth={1} height={40} width={40} />
                        </Link>
                    </SheetClose>

                    <SheetClose asChild>
                        <Link
                            to="/products/turntables"
                            className="group flex h-20 flex-row items-center justify-between border-t border-foreground bg-secondary/0 px-7 transition-colors duration-200 hover:bg-secondary/30"
                        >
                            <div className="">Turntables</div>
                            <MoveRight strokeWidth={1} height={40} width={40} />
                        </Link>
                    </SheetClose>

                    <SheetClose asChild>
                        <Link
                            to="/products/accessories"
                            className="group flex h-20 flex-row items-center justify-between border-t border-foreground bg-secondary/0 px-7 transition-colors duration-200 hover:bg-secondary/30"
                        >
                            <div className="">Accessories</div>
                            <MoveRight strokeWidth={1} height={40} width={40} />
                        </Link>
                    </SheetClose>

                    <SheetClose asChild>
                        <Link
                            to="/products/merch"
                            className="group flex h-20 flex-row items-center justify-between border-t border-foreground bg-secondary/0 px-7 transition-colors duration-200 hover:bg-secondary/30"
                        >
                            <div className="">Merch</div>
                            <MoveRight strokeWidth={1} height={40} width={40} />
                        </Link>
                    </SheetClose>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

export default MenuSheet;
