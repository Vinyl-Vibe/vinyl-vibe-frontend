import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet.jsx";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, X, Copy } from "lucide-react";
import { useStoreManagement } from "@/store/store-management";
import { useState, useEffect } from "react";

export default function AdminOrderSheet({ order, open, onOpenChange }) {
    const { updateOrderStatus } = useStoreManagement();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    // Reset success state after a delay
    useEffect(() => {
        let timeout;
        if (updateSuccess) {
            timeout = setTimeout(() => setUpdateSuccess(false), 2000);
        }
        return () => clearTimeout(timeout);
    }, [updateSuccess]);

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            const result = await updateOrderStatus(order._id, newStatus);
            if (result.success) {
                setUpdateSuccess(true);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Don't return null immediately - let the sheet animate out
    // Instead, use order data only when rendering content

    // Helper to safely format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return {
                date: format(date, "do MMM yyyy"),
                time: format(date, "h:mm a"),
            };
        } catch (error) {
            return {
                date: "Date not available",
                time: "Time not available",
            };
        }
    };

    // Add copy to clipboard function
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-[540px]">
                {order && (
                    <>
                        <SheetHeader className="flex h-full max-h-20 flex-row items-center justify-between border-b px-6">
                            <SheetTitle className="text-3xl font-medium tracking-[-0.1rem]">
                                View order
                            </SheetTitle>
                            <SheetDescription className="hidden">
                                View order details
                            </SheetDescription>
                            <SheetClose>
                                <div className="transition-colors-opacity flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                                    <X className="h-4 w-4" />
                                </div>
                            </SheetClose>
                        </SheetHeader>
                        {/* Main content container */}
                        <div className="flex h-full flex-col">
                            {/* Top section with fixed content */}
                            <div className="grid grid-cols-1 gap-6 p-6 py-4 md:grid-cols-2">
                                {/* Status - Left Column (1/3) */}
                                <div className="md:col-span-1">
                                    <div className="mb-3 flex items-center gap-2">
                                        <h4 className="text-sm font-medium">
                                            Status
                                        </h4>
                                        {isUpdating && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                        {updateSuccess && (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <Select
                                            value={order.status}
                                            onValueChange={handleStatusChange}
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="preparing to ship">
                                                    Preparing to Ship
                                                </SelectItem>
                                                <SelectItem value="shipped">
                                                    Shipped
                                                </SelectItem>
                                                <SelectItem value="delivered">
                                                    Delivered
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="returned">
                                                    Returned
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                                <SelectItem value="payment received">
                                                    Payment Received
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Order Details - Right Column */}
                                <div className="md:col-span-1">
                                    <h4 className="mb-3 text-sm font-medium">
                                        Order Details
                                    </h4>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <h5 className="text-sm text-muted-foreground">
                                                    Order ID
                                                </h5>
                                                <div
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            order._id,
                                                        )
                                                    }
                                                    className="group cursor-pointer"
                                                >
                                                    <Copy
                                                        className={`h-3 w-3 ${
                                                            copied
                                                                ? "text-foreground"
                                                                : "text-muted-foreground"
                                                        } transition-colors group-hover:text-foreground/80`}
                                                    />
                                                </div>
                                                {copied && (
                                                    <span className="text-xs text-foreground">
                                                        Copied!
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-medium">
                                                {order._id}
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="mb-2 text-sm text-muted-foreground">
                                                Created
                                            </h5>
                                            <div className="space-y-0 font-medium">
                                                <p className="font-medium">
                                                    {
                                                        formatDate(
                                                            order.createdAt,
                                                        ).date
                                                    }
                                                    {" at "}
                                                    {
                                                        formatDate(
                                                            order.createdAt,
                                                        ).time
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info section continues below */}
                            <div className="mt-6 px-6">
                                <div className="rounded-2xl border py-4">
                                    <h4 className="mb-4 px-4 text-sm font-medium">
                                        Customer Details
                                    </h4>
                                    <Separator className="mb-5" />
                                    <div className="grid gap-4 px-4 text-sm md:grid-cols-2">
                                        <div>
                                            <h5 className="mb-2 text-sm text-muted-foreground">
                                                Email address
                                            </h5>
                                            <div className="mb-5 space-y-1">
                                                <p className="font-medium">
                                                    {order.userId?.email ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                            <h5 className="mb-2 text-sm text-muted-foreground">
                                                Phone number
                                            </h5>
                                            <div className="space-y-1">
                                                <p className="font-medium">
                                                    {order.userId?.profile
                                                        ?.phone || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="mb-2 text-sm text-muted-foreground">
                                                Shipping Address
                                            </h5>
                                            {order.shippingAddress ? (
                                                <div className="space-y-1">
                                                    <p>
                                                        {
                                                            order
                                                                .shippingAddress
                                                                .street
                                                        }
                                                    </p>
                                                    <p>
                                                        {[
                                                            order
                                                                .shippingAddress
                                                                .city,
                                                            order
                                                                .shippingAddress
                                                                .state,
                                                            order
                                                                .shippingAddress
                                                                .postalCode,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </p>
                                                    <p>
                                                        {
                                                            order
                                                                .shippingAddress
                                                                .country
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <p>
                                                    No shipping address provided
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable items section */}
                            <div className="flex-1 overflow-hidden px-6 pt-6">
                                <h4 className="mb-4 text-sm font-medium">
                                    Items
                                </h4>
                                <ScrollArea className="h-[calc(100%-2rem)]">
                                    <div className="space-y-4">
                                        {(order.products || []).map((item) => (
                                            <div
                                                key={
                                                    item.productId?._id ||
                                                    item._id
                                                }
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-16 w-16">
                                                        <img
                                                            src={
                                                                item.productId
                                                                    ?.thumbnail ||
                                                                "/missing_image.png"
                                                            }
                                                            alt={
                                                                item.productId
                                                                    ?.name ||
                                                                "Product"
                                                            }
                                                            className="h-full w-full rounded-md border object-cover"
                                                            onError={(e) => {
                                                                e.target.src =
                                                                    "/missing_image.png";
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {item.productId
                                                                ?.name ||
                                                                "Unknown Product"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium">
                                                    $
                                                    {(
                                                        (item.price || 0) *
                                                        (item.quantity || 1)
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Footer with totals - styled version */}
                            <div className="mt-auto border-t bg-secondary/50">
                                <div className="space-y-3 p-6">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <p>Subtotal</p>
                                        <p>${(order.total || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <p>Shipping</p>
                                        <p>Free</p>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-lg font-medium">
                                        <p>Total</p>
                                        <p>${(order.total || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
