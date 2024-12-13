import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useCartStore } from "../../store/cart";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

function CartSheet() {
    const { items = [], isLoading } = useCartStore();
    const navigate = useNavigate();

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

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="" className="relative" size="icon">
                    <ShoppingCart className="h-4 w-4" />
                    {itemCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -bottom-[4px] -right-[8px] flex h-6 w-6 items-center justify-center rounded-full border-[.5px] border-border bg-accent p-0 pt-[.25px] text-xs font-medium text-foreground hover:bg-accent"
                        >
                            {itemCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex max-h-svh max-w-full w-[30rem] flex-col p-6 px-0 pt-0 space-y-0 gap-0">
                <SheetHeader className="flex justify-center px-6 max-h-20 h-full">
                    <SheetTitle className="text-4xl font-medium tracking-[-0.12rem]">
                        Cart
                    </SheetTitle>
                </SheetHeader>
                <Separator className="mb-4" />
                <ScrollArea className="h-full px-6">
                    {!Array.isArray(items) || items.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-muted-foreground">
                                Your cart is empty
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
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
                                    ${subtotal.toFixed(2)}
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
