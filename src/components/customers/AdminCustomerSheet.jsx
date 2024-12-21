import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useStoreManagement } from "@/store/store-management";
import { X } from "lucide-react";
import { Copy } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import NumberFlow from "@number-flow/react";

export default function AdminCustomerSheet({ customer, open, onOpenChange }) {
    const navigate = useNavigate();
    const { getCustomerOrders, updateUserRole } = useStoreManagement();
    const [customerOrders, setCustomerOrders] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [stats, setStats] = useState({
        totalSpent: 0,
        totalOrders: 0,
        totalItems: 0,
        averageOrderValue: 0,
        lastOrderDate: null,
    });
    const [copiedField, setCopiedField] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState(false);

    // Update currentCustomer when customer prop changes
    useEffect(() => {
        if (customer) {
            setCurrentCustomer(customer);
        }
    }, [customer]);

    // Fetch customer orders when sheet opens
    useEffect(() => {
        const fetchOrders = async () => {
            if (currentCustomer && open) {
                try {
                    const orders = await getCustomerOrders(currentCustomer._id);

                    if (Array.isArray(orders)) {
                        setCustomerOrders(orders);

                        // Calculate stats from orders
                        const totalSpent = orders.reduce(
                            (sum, order) => sum + (order.total || 0),
                            0,
                        );

                        const totalItems = orders.reduce(
                            (sum, order) =>
                                sum +
                                (order.products || []).reduce(
                                    (itemSum, product) =>
                                        itemSum + (product.quantity || 0),
                                    0,
                                ),
                            0,
                        );

                        const avgOrderValue = orders.length
                            ? totalSpent / orders.length
                            : 0;

                        // Sort orders by date and get the latest
                        const sortedOrders = [...orders].sort(
                            (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt),
                        );

                        setStats({
                            totalSpent,
                            totalOrders: orders.length,
                            totalItems,
                            averageOrderValue: avgOrderValue,
                            lastOrderDate: sortedOrders[0]?.createdAt || null,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching customer orders:", error);
                    // Reset states on error
                    setCustomerOrders([]);
                    setStats({
                        totalSpent: 0,
                        totalOrders: 0,
                        totalItems: 0,
                        averageOrderValue: 0,
                        lastOrderDate: null,
                    });
                }
            }
        };

        fetchOrders();
    }, [currentCustomer, open, getCustomerOrders]);

    // Handle sheet closing
    const handleSheetClose = (open) => {
        if (!open) {
            setCurrentCustomer(null);
            setCustomerOrders([]);
            setStats({
                totalSpent: 0,
                totalOrders: 0,
                totalItems: 0,
                averageOrderValue: 0,
                lastOrderDate: null,
            });
        }
        onOpenChange(open);
    };

    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            // Reset copied state after 2 seconds
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleRoleChange = async (newRole) => {
        setIsUpdating(true);
        setUpdateError(false);
        setUpdateSuccess(false);
        try {
            const result = await updateUserRole(currentCustomer._id, newRole);
            if (result.success) {
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 2000);
            } else {
                setUpdateError(true);
                setTimeout(() => setUpdateError(false), 2000);
            }
        } catch (error) {
            console.error("Failed to update role:", error);
            setUpdateError(true);
            setTimeout(() => setUpdateError(false), 2000);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={handleSheetClose}>
            <SheetContent className="flex w-full flex-col gap-0 space-y-0 p-0 sm:max-w-[540px]">
                {currentCustomer ? (
                    <>
                        {/* Fixed Header */}
                        <SheetHeader className="flex h-20 shrink-0 flex-row items-center justify-between border-b px-6">
                            <SheetTitle className="text-3xl font-medium tracking-[-0.1rem]">
                                View customer
                            </SheetTitle>
                            <SheetDescription className="hidden">
                                View customer details
                            </SheetDescription>
                            <SheetClose>
                                <div className="transition-colors-opacity flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-secondary text-foreground duration-200 hover:border-foreground/10 hover:bg-secondary/50">
                                    <X className="h-4 w-4" />
                                </div>
                            </SheetClose>
                        </SheetHeader>

                        {/* Main Content Area */}
                        <div className="flex min-h-0 flex-1 flex-col">
                            <ScrollArea className="flex-1">
                                <div className="flex flex-col">
                                    {/* Personal Info Section */}
                                    <div className="py-6">
                                        <div className="mx-6 mb-6 rounded-2xl border py-4 pt-2">
                                            <div className="mb-2 flex items-center justify-between px-4">
                                                <h4 className="text-sm font-medium">
                                                    User details
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={
                                                            currentCustomer.role
                                                        }
                                                        onValueChange={
                                                            handleRoleChange
                                                        }
                                                        disabled={isUpdating}
                                                    >
                                                        <SelectTrigger className="w-[205px] bg-white/80">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl">
                                                            <SelectItem value="user">
                                                                User
                                                            </SelectItem>
                                                            <SelectItem value="admin">
                                                                Admin
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {isUpdating && (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    )}
                                                    {updateSuccess && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    )}
                                                    {updateError && (
                                                        <X className="h-4 w-4 text-destructive" />
                                                    )}
                                                </div>
                                            </div>
                                            <Separator className="mb-5" />
                                            <div className="grid gap-4 px-4 text-sm md:grid-cols-2">
                                                <div>
                                                    {currentCustomer.profile
                                                        ?.firstName && (
                                                        <div>
                                                            <h5 className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                                Name
                                                                <div
                                                                    onClick={() =>
                                                                        copyToClipboard(
                                                                            `${currentCustomer.profile?.firstName || ""} ${currentCustomer.profile?.lastName || ""}`.trim(),
                                                                            "name",
                                                                        )
                                                                    }
                                                                    className="group cursor-pointer"
                                                                >
                                                                    <Copy
                                                                        className={`h-3 w-3 ${
                                                                            copiedField ===
                                                                            "name"
                                                                                ? "text-foreground"
                                                                                : "text-muted-foreground"
                                                                        } transition-colors group-hover:text-foreground/80`}
                                                                    />
                                                                </div>
                                                                {copiedField ===
                                                                    "name" && (
                                                                    <span className="text-xs text-foreground">
                                                                        Copied!
                                                                    </span>
                                                                )}
                                                            </h5>
                                                            <div className="mb-5 space-y-1">
                                                                <p className="font-medium">
                                                                    {`${currentCustomer.profile.firstName} ${currentCustomer.profile.lastName || ""}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <h5 className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                        Email
                                                        <div
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    currentCustomer.email,
                                                                    "email",
                                                                )
                                                            }
                                                            className="group cursor-pointer"
                                                        >
                                                            <Copy
                                                                className={`h-3 w-3 ${
                                                                    copiedField ===
                                                                    "email"
                                                                        ? "text-foreground"
                                                                        : "text-muted-foreground"
                                                                } transition-colors group-hover:text-foreground/80`}
                                                            />
                                                        </div>
                                                        {copiedField ===
                                                            "email" && (
                                                            <span className="text-xs text-foreground">
                                                                Copied!
                                                            </span>
                                                        )}
                                                    </h5>
                                                    <div className="mb-5 space-y-1">
                                                        <p className="font-medium">
                                                            {currentCustomer.email ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                    <h5 className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                        Phone number
                                                        <div
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    currentCustomer
                                                                        .profile
                                                                        ?.phoneNumber,
                                                                    "phone",
                                                                )
                                                            }
                                                            className="group cursor-pointer"
                                                        >
                                                            <Copy
                                                                className={`h-3 w-3 ${
                                                                    copiedField ===
                                                                    "phone"
                                                                        ? "text-foreground"
                                                                        : "text-muted-foreground"
                                                                } transition-colors group-hover:text-foreground/80`}
                                                            />
                                                        </div>
                                                        {copiedField ===
                                                            "phone" && (
                                                            <span className="text-xs text-foreground">
                                                                Copied!
                                                            </span>
                                                        )}
                                                    </h5>
                                                    <div className="space-y-1">
                                                        <p className="font-medium">
                                                            {currentCustomer
                                                                .profile
                                                                ?.phoneNumber ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="pl-5">
                                                    <h5 className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                        Address
                                                        <div
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    currentCustomer
                                                                        .profile
                                                                        ?.address
                                                                        ? `${currentCustomer.profile.address.street}, ${[
                                                                              currentCustomer
                                                                                  .profile
                                                                                  .address
                                                                                  .city,
                                                                              currentCustomer
                                                                                  .profile
                                                                                  .address
                                                                                  .state,
                                                                              currentCustomer
                                                                                  .profile
                                                                                  .address
                                                                                  .postalCode,
                                                                          ]
                                                                              .filter(
                                                                                  Boolean,
                                                                              )
                                                                              .join(
                                                                                  ", ",
                                                                              )}, ${currentCustomer.profile.address.country}`
                                                                        : "No address provided",
                                                                    "address",
                                                                )
                                                            }
                                                            className="group cursor-pointer"
                                                        >
                                                            <Copy
                                                                className={`h-3 w-3 ${
                                                                    copiedField ===
                                                                    "address"
                                                                        ? "text-foreground"
                                                                        : "text-muted-foreground"
                                                                } transition-colors group-hover:text-foreground/80`}
                                                            />
                                                        </div>
                                                        {copiedField ===
                                                            "address" && (
                                                            <span className="text-xs text-foreground">
                                                                Copied!
                                                            </span>
                                                        )}
                                                    </h5>
                                                    {currentCustomer.profile
                                                        ?.address ? (
                                                        <div className="space-y-1">
                                                            <p>
                                                                {
                                                                    currentCustomer
                                                                        .profile
                                                                        .address
                                                                        .street
                                                                }
                                                            </p>
                                                            <p>
                                                                {[
                                                                    currentCustomer
                                                                        .profile
                                                                        .address
                                                                        .city,
                                                                    currentCustomer
                                                                        .profile
                                                                        .address
                                                                        .state,
                                                                    currentCustomer
                                                                        .profile
                                                                        .address
                                                                        .postalCode,
                                                                ]
                                                                    .filter(
                                                                        Boolean,
                                                                    )
                                                                    .join(", ")}
                                                            </p>
                                                            <p>
                                                                {
                                                                    currentCustomer
                                                                        .profile
                                                                        .address
                                                                        .country
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p>
                                                            No address provided
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Section */}
                                        <div className="border-t px-6 py-6">
                                            <h4 className="mb-4 text-sm font-medium">
                                                Customer Stats
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="rounded-2xl border p-3">
                                                    <p className="text-muted-foreground">
                                                        Total Spent
                                                    </p>
                                                    <p className="text-2xl font-medium">
                                                        $
                                                        <NumberFlow
                                                            value={stats.totalSpent.toFixed(
                                                                2,
                                                            )}
                                                        />
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border p-3">
                                                    <p className="text-muted-foreground">
                                                        Orders
                                                    </p>
                                                    <p className="text-2xl font-medium">
                                                        <NumberFlow
                                                            value={
                                                                stats.totalOrders
                                                            }
                                                        />
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border p-3">
                                                    <p className="text-muted-foreground">
                                                        Items Bought
                                                    </p>
                                                    <p className="text-2xl font-medium">
                                                        <NumberFlow
                                                            value={
                                                                stats.totalItems
                                                            }
                                                        />
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border p-3">
                                                    <p className="text-muted-foreground">
                                                        Avg. Order
                                                    </p>
                                                    <p className="text-2xl font-medium">
                                                        $
                                                        <NumberFlow
                                                            value={stats.averageOrderValue.toFixed(
                                                                2,
                                                            )}
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order History Section */}
                                        <div className="border-t px-6 py-6">
                                            <h4 className="mb-4 text-sm font-medium">
                                                Order History
                                            </h4>
                                            <div className="space-y-4">
                                                {customerOrders.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
                                                        <p className="text-sm text-muted-foreground">
                                                            This customer hasn't
                                                            placed any orders
                                                            yet
                                                        </p>
                                                    </div>
                                                ) : (
                                                    customerOrders.map(
                                                        (order) => (
                                                            <div
                                                                key={order._id}
                                                                className="flex items-center justify-between rounded-2xl border p-4"
                                                            >
                                                                <div className="space-y-1">
                                                                    <p className="text-sm">
                                                                        Order #
                                                                        {
                                                                            order._id
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {format(
                                                                            new Date(
                                                                                order.createdAt,
                                                                            ),
                                                                            "PPP",
                                                                        )}
                                                                        <span
                                                                            className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                                order.status ===
                                                                                "pending"
                                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                                    : order.status ===
                                                                                        "preparing to ship"
                                                                                      ? "bg-blue-100 text-blue-800"
                                                                                      : order.status ===
                                                                                          "shipped"
                                                                                        ? "bg-indigo-100 text-indigo-800"
                                                                                        : order.status ===
                                                                                                "delivered" ||
                                                                                            order.status ===
                                                                                                "completed"
                                                                                          ? "bg-green-100 text-green-800"
                                                                                          : order.status ===
                                                                                              "returned"
                                                                                            ? "bg-orange-100 text-orange-800"
                                                                                            : order.status ===
                                                                                                "cancelled"
                                                                                              ? "bg-red-100 text-red-800"
                                                                                              : order.status ===
                                                                                                  "payment received"
                                                                                                ? "bg-emerald-100 text-emerald-800"
                                                                                                : "bg-gray-100 text-gray-800"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                order.status
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-base font-medium">
                                                                        $
                                                                        {order.total.toFixed(
                                                                            2,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant=""
                                                                    onClick={() => {
                                                                        navigate(
                                                                            `/admin/orders?orderId=${order._id}`,
                                                                        );
                                                                        onOpenChange(
                                                                            false,
                                                                        );
                                                                    }}
                                                                >
                                                                    View Order
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </>
                ) : null}
                <SheetDescription className="hidden">
                    User details
                </SheetDescription>
                <SheetTitle className="hidden">User details </SheetTitle>
            </SheetContent>
        </Sheet>
    );
}
