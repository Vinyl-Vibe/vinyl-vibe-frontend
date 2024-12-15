import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Loader2, ShoppingCart, ShoppingBag, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useCartStore } from "../../store/cart";
import CartItem from "./CartItem";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Badge } from "../ui/badge";

import NumberFlow from "@number-flow/react";

function CartSheet() {
    const { items = [], isLoading } = useCartStore();
    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="" className="relative" size="icon">
                    <ShoppingCart className="h-4 w-4" />
                    {itemCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -bottom-[4px] -right-[8px] flex h-7 w-7 items-center justify-center rounded-full border-[.5px] border-border bg-accent p-0 pt-[.5px] text-[0.8rem] font-medium text-black hover:bg-accent"
                        >
                            {itemCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex max-h-dvh w-[30rem] max-w-full flex-col gap-0 space-y-0 p-6 px-0 pt-0">
                <SheetHeader className="flex h-full max-h-20 flex-row items-center justify-between px-6">
                    <SheetTitle className="text-4xl font-medium tracking-[-0.12rem]">
                        Cart
                    </SheetTitle>
                    <SheetClose>
                        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground transition-colors transition-opacity duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                            <X className="h-4 w-4" />
                        </div>
                    </SheetClose>
                </SheetHeader>
                <Separator className="mb-4" />
                <div
                    className={`flex h-full w-full flex-col items-center ${
                        !Array.isArray(items) || items.length === 0
                            ? "justify-center"
                            : ""
                    }`}
                >
                    <ScrollArea className="w-full px-0">
                        {!Array.isArray(items) || items.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                                <div className="rounded-full bg-muted p-6">
                                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-medium">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-md text-muted-foreground">
                                        Add items to your cart to get started
                                    </p>
                                </div>
                                <SheetClose asChild>
                                    <Button
                                        variant="secondary"
                                        className="mt-4"
                                        onClick={handleShopNowClick}
                                    >
                                        Shop now
                                    </Button>
                                </SheetClose>
                            </div>
                        ) : (
                            <div className="w-full divide-y">
                                {items.map((item) =>
                                    item?.product?._id ? (
                                        <CartItem
                                            key={item.product._id}
                                            item={item}
                                        />
                                    ) : null,
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {itemCount > 0 && (
                    <div className="flex flex-col gap-6 pt-6">
                        <Separator />
                        <div className="space-y-1.5 px-6">
                            <div className="flex">
                                <span className="flex-1">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex">
                                <span className="flex-1 font-medium">
                                    Total
                                </span>
                                <span className="font-medium">
                                    <NumberFlow
                                        value={subtotal}
                                        suffix="AUD"
                                        format={{
                                            style: "currency",
                                            currency: "AUD",
                                            trailingZeroDisplay:
                                                "stripIfInteger",
                                        }}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="w-full px-5">
                            <Button
                                variant="secondary"
                                className="text-md h-12 w-full"
                                onClick={handleCheckout}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Checkout"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

export default CartSheet;
