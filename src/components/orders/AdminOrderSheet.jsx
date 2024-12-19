import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
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
import { CheckCircle2, Loader2 } from "lucide-react";
import { useStoreManagement } from "@/store/store-management";
import { useState, useEffect } from "react";

export default function AdminOrderSheet({ order, open, onOpenChange }) {
    const { updateOrderStatus } = useStoreManagement();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

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
            return format(new Date(dateString), "PPP");
        } catch (error) {
            return "Date not available";
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col sm:max-w-[540px]">
                {order && ( // Only render content if order exists
                    <>
                        <SheetHeader className="space-y-1">
                            <SheetTitle>Order Details</SheetTitle>
                            <SheetDescription>
                                Order ID: {order._id}
                            </SheetDescription>
                        </SheetHeader>
                        <Separator className="my-4" />
                        <div className="flex-1 overflow-hidden">
                            {/* Status */}
                            <div>
                                <h4 className="text-sm font-medium">Status</h4>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={order.status}
                                        onValueChange={handleStatusChange}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    {isUpdating && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    {updateSuccess && (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    )}
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h4 className="mb-2 text-sm font-medium">
                                    Customer
                                </h4>
                                <div className="text-sm">
                                    <p>Email: {order.userId?.email || "N/A"}</p>
                                    <p>
                                        Created: {formatDate(order.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">
                                        Shipping Address
                                    </h4>
                                    <div className="text-sm">
                                        <p>
                                            {order.shippingAddress.street ||
                                                "N/A"}
                                        </p>
                                        <p>
                                            {[
                                                order.shippingAddress.city,
                                                order.shippingAddress.state,
                                            ]
                                                .filter(Boolean)
                                                .join(", ") || "N/A"}
                                        </p>
                                        <p>
                                            {order.shippingAddress.postalCode ||
                                                "N/A"}
                                        </p>
                                        <p>
                                            {order.shippingAddress.country ||
                                                "N/A"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-5">
                                <div className="mt-5">
                                    <h4 className="mb-4 text-sm font-medium">
                                        Items
                                    </h4>
                                    <Separator className="my-4" />
                                    <ScrollArea className="h-[300px] pr-4">
                                        <div className="h-full">
                                            <div className="space-y-4">
                                                {(order.products || []).map(
                                                    (item) => (
                                                        <div
                                                            key={
                                                                item.productId
                                                                    ?._id ||
                                                                item._id
                                                            }
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <div className="h-16 w-16">
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .productId
                                                                                ?.thumbnail ||
                                                                            "/missing_image.png"
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .productId
                                                                                ?.name ||
                                                                            "Product"
                                                                        }
                                                                        className="h-full w-full rounded-md border object-cover"
                                                                        onError={(
                                                                            e,
                                                                        ) => {
                                                                            e.target.src =
                                                                                "/missing_image.png";
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {item
                                                                            .productId
                                                                            ?.name ||
                                                                            "Unknown Product"}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Qty:{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-medium">
                                                                $
                                                                {(
                                                                    (item.unitPrice ||
                                                                        0) *
                                                                    (item.quantity ||
                                                                        1)
                                                                ).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="mt-4">
                            <div className="w-full space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <p>Subtotal</p>
                                    <p className="font-medium">
                                        ${(order.total || 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Shipping</p>
                                    <p className="font-medium">Free</p>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-medium">
                                    <p>Total</p>
                                    <p>${(order.total || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
