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
import { Search, ArrowUpDown } from "lucide-react";
import AdminOrderSheet from "@/components/orders/AdminOrderSheet";
import { useSearchParams } from "react-router-dom";

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

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

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
        const orderId = searchParams.get('orderId')
        if (orderId && orders.length > 0) {
            const order = orders.find(o => o._id === orderId)
            if (order) {
                setSelectedOrder(order)
            }
        }
    }, [orders, searchParams])

    // Update URL when order is selected
    const handleOrderSelect = useCallback((order) => {
        setSelectedOrder(order)
        setSearchParams({ orderId: order._id })
    }, [setSearchParams])

    // Clear URL when sheet closes
    const handleSheetClose = useCallback((open) => {
        if (!open) {
            setSelectedOrder(null)
            setSearchParams({})
        }
    }, [setSearchParams])

    const toggleSort = (field) => {
        setFilters((prev) => ({
            ...prev,
            sortBy: field,
            sortDirection:
                prev.sortBy === field && prev.sortDirection === "desc"
                    ? "asc"
                    : "desc",
        }));
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
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
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleSort("date")}
                                        >
                                            Date
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleSort("total")}
                                        >
                                            Total
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium">
                                            {order._id}
                                        </TableCell>
                                        <TableCell>
                                            {order.userId.email}
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(order.createdAt),
                                                "MMM d, yyyy",
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    order.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : order.status === "preparing to ship"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : order.status === "shipped"
                                                        ? "bg-indigo-100 text-indigo-800"
                                                        : order.status === "delivered" || order.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : order.status === "returned"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : order.status === "cancelled"
                                                        ? "bg-red-100 text-red-800"
                                                        : order.status === "payment received"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            ${order.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant=""
                                                size="sm"
                                                onClick={() => {
                                                    handleOrderSelect(order)
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Load More Button */}
                    {hasMoreOrders && (
                        <div className="mt-4 flex justify-center">
                            <Button
                                onClick={loadMoreOrders}
                                disabled={isLoading}
                                variant="outline"
                            >
                                {isLoading ? "Loading..." : "Load More Orders"}
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
