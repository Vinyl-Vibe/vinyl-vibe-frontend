import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { format } from "date-fns";
import NumberFlow from "@number-flow/react";
import { ScrollArea } from "../ui/scroll-area";

export function OrderDialog({ order, open, onOpenChange }) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (!order) return null;

    const OrderDetails = ({ className }) => (
        <ScrollArea className={cn("pr-6", className)}>
            {/* Order Summary */}
            <div className="space-y-6">
                <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Order ID</div>
                    <div className="font-mono">{order._id}</div>
                </div>
                <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Date</div>
                    <div>{format(new Date(order.createdAt), "PPP")}</div>
                </div>
                <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Status</div>
                    <div className="capitalize">{order.status}</div>
                </div>

                {/* Products List */}
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">Products</div>
                    {order.products.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 rounded-lg border p-4"
                        >
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                <img
                                    src={item.productId.thumbnail || "/missing_image.png"}
                                    alt={item.productId.name}
                                    className={`h-full w-full object-cover ${!item.productId.thumbnail ? "opacity-50" : ""}`}
                                />
                            </div>
                            <div className="flex flex-1 flex-col">
                                <div className="flex justify-between text-base">
                                    <h3>{item.productId.name}</h3>
                                    <NumberFlow
                                        value={item.price * item.quantity}
                                        format={{
                                            style: "currency",
                                            currency: "AUD",
                                        }}
                                    />
                                </div>
                                <div className="flex text-sm text-muted-foreground">
                                    <p>Qty {item.quantity}</p>
                                    <span className="mx-2">×</span>
                                    <NumberFlow
                                        value={item.price}
                                        format={{
                                            style: "currency",
                                            currency: "AUD",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Total */}
                <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                        <div className="text-muted-foreground">Subtotal</div>
                        <NumberFlow
                            value={order.total}
                            format={{
                                style: "currency",
                                currency: "AUD",
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <div className="text-muted-foreground">Shipping</div>
                        <div>Free</div>
                    </div>
                    <div className="flex justify-between text-base font-medium">
                        <div>Total</div>
                        <NumberFlow
                            value={order.total}
                            format={{
                                style: "currency",
                                currency: "AUD",
                            }}
                        />
                    </div>
                </div>
            </div>
        </ScrollArea>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[90vh] space-y-4 p-0 sm:max-w-[600px]">
                    <DialogHeader className="items-top flex h-14 flex-row justify-between space-y-6 border-b px-6">
                        <DialogTitle className="text-3xl font-medium tracking-[-0.1rem]">
                            Order Details
                        </DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute -top-1 right-6"
                        >
                            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground transition-colors duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                                <X className="h-4 w-4" />
                            </div>
                        </button>
                    </DialogHeader>
                    <OrderDetails className="px-6 pb-6" />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className="items-top flex h-14 flex-row justify-between space-y-6 border-b px-6">
                    <DrawerTitle className="text-3xl font-medium tracking-[-0.1rem]">
                        Order Details
                    </DrawerTitle>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute -top-1 right-6"
                    >
                        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground transition-colors duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                            <X className="h-4 w-4" />
                        </div>
                    </button>
                </DrawerHeader>
                <OrderDetails className="p-6" />
            </DrawerContent>
        </Drawer>
    );
} 