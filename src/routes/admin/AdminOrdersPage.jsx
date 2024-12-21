import { useEffect, useState, useCallback } from "react";
import { useStoreManagement } from "../../store/store-management";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Search } from "lucide-react";
import AdminOrderSheet from "@/components/orders/AdminOrderSheet";
import { useSearchParams } from "react-router-dom";
import { SortButton } from "@/components/ui/sort-button";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function AdminOrdersPage() {
    const {
        orders,
        isLoading,
        error,
        fetchOrders,
        loadMoreOrders,
        hasMoreOrders,
    } = useStoreManagement();
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        sortBy: "date",
        sortDirection: "desc",
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [sortDirection, setSortDirection] = useState({
        date: "none",
        total: "none",
    });

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Apply filters and sorting
    useEffect(() => {
        let result = [...orders];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (order) =>
                    order._id.toLowerCase().includes(searchLower) ||
                    order.userId.email.toLowerCase().includes(searchLower),
            );
        }

        // Apply status filter
        if (filters.status !== "all") {
            result = result.filter((order) => order.status === filters.status);
        }

        // Apply sorting
        result.sort((a, b) => {
            if (filters.sortBy === "date") {
                return filters.sortDirection === "desc"
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt);
            }
            if (filters.sortBy === "total") {
                return filters.sortDirection === "desc"
                    ? b.total - a.total
                    : a.total - b.total;
            }
            return 0;
        });

        setFilteredOrders(result);
    }, [orders, filters]);

    // Handle opening order from URL parameter
    useEffect(() => {
        const orderId = searchParams.get("orderId");
        if (orderId && orders.length > 0) {
            const order = orders.find((o) => o._id === orderId);
            if (order) {
                setSelectedOrder(order);
            }
        }
    }, [orders, searchParams]);

    // Update URL when order is selected
    const handleOrderSelect = useCallback(
        (order) => {
            setSelectedOrder(order);
            setSearchParams({ orderId: order._id });
        },
        [setSearchParams],
    );

    // Clear URL when sheet closes
    const handleSheetClose = useCallback(
        (open) => {
            if (!open) {
                setSelectedOrder(null);
                setSearchParams({});
            }
        },
        [setSearchParams],
    );

    const toggleSort = (field) => {
        setSortDirection((prev) => {
            const newDirection =
                prev[field] === "none"
                    ? "asc"
                    : prev[field] === "asc"
                      ? "desc"
                      : "none";
            // Reset other fields
            return Object.keys(prev).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: key === field ? newDirection : "none",
                }),
                {},
            );
        });

        const newOrders = [...filteredOrders].sort((a, b) => {
            if (field === "date") {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sortDirection.date === "asc"
                    ? dateB - dateA
                    : dateA - dateB;
            }
            if (field === "total") {
                return sortDirection.total === "asc"
                    ? b.total - a.total
                    : a.total - b.total;
            }
            return 0;
        });

        setFilteredOrders(newOrders);
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex-1 space-y-4 p-4 pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Orders</CardTitle>
                    <CardDescription>
                        Manage and view all orders from your store
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-8"
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        search: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <Select
                            value={filters.status}
                            onValueChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="preparing to ship">
                                    Preparing to Ship
                                </SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">
                                    Delivered
                                </SelectItem>
                                <SelectItem value="returned">
                                    Returned
                                </SelectItem>
                                <SelectItem value="completed">
                                    Completed
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

                    {/* Orders Table */}
                    {isLoading && !orders.length ? (
                        <TableSkeleton rowCount={8} />
                    ) : filteredOrders.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="show-wide hidden">
                                            Order ID
                                        </TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>
                                            <SortButton
                                                label="Date"
                                                direction={sortDirection.date}
                                                onClick={() =>
                                                    toggleSort("date")
                                                }
                                            />
                                        </TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            Status
                                        </TableHead>
                                        <TableHead>
                                            <SortButton
                                                label="Total"
                                                direction={sortDirection.total}
                                                onClick={() =>
                                                    toggleSort("total")
                                                }
                                            />
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell className="show-wide hidden font-medium">
                                                <span className="block max-w-[80px] truncate">
                                                    {order._id}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="block max-w-[100px] truncate md:max-w-[150px]">
                                                    {order.userId.email}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(order.createdAt),
                                                    windowWidth < 640
                                                        ? "MM/dd"
                                                        : windowWidth < 768
                                                          ? "MM/dd/yy"
                                                          : "MMM d, yyyy",
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <span
                                                    className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${
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
                                                    {order.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                $
                                                {windowWidth < 640
                                                    ? order.total.toFixed(0)
                                                    : order.total.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant=""
                                                    className="hover:bg-accent/10"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleOrderSelect(order)
                                                    }
                                                >
                                                    View details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyState
                            type={filters.search ? "search" : "status"}
                        />
                    )}

                    {/* Load More Button */}
                    {hasMoreOrders &&
                        !filters.search &&
                        !isLoading &&
                        filters.status === "all" && (
                            <div className="mt-4 flex justify-center">
                                <Button
                                    onClick={loadMoreOrders}
                                    disabled={isLoading}
                                    variant="secondary"
                                >
                                    {isLoading
                                        ? "Loading..."
                                        : "Load More Orders"}
                                </Button>
                            </div>
                        )}
                </CardContent>
            </Card>
            <AdminOrderSheet
                order={selectedOrder}
                open={!!selectedOrder}
                onOpenChange={handleSheetClose}
            />
        </div>
    );
}
