import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../../api/orders";
import MainNav from "../../components/layout/MainNav";
import { Button } from "../../components/ui/button";
import { Loader2, Package } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import NumberFlow from "@number-flow/react";
import { OrderDialog } from "../../components/orders/OrderDialog";

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await ordersApi.getMyOrders();
                setOrders(data.orders);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("Failed to load orders. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <>
                <MainNav />
                <main className="mx-auto w-full max-w-7xl pb-6 pt-[calc(5rem-1px)]">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <MainNav />
            <main className="mx-auto w-full max-w-7xl pb-6 pt-[calc(5rem-1px)]">
                <div className="border px-6 pb-6 pt-40">
                    <h1 className="text-5xl font-medium tracking-tight">
                        Orders
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 border p-6">
                        <div className="rounded-full bg-muted p-3">
                            <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-semibold">
                                No orders yet
                            </h3>
                            <p className="text-muted-foreground">
                                When you place orders, they will appear here.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/products")}
                        >
                            Browse Products
                        </Button>
                    </div>
                ) : (
                    <div className="border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Items</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow 
                                        key={order._id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <TableCell className="font-mono">
                                            {order._id}
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(order.createdAt),
                                                "PPP",
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize">
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <NumberFlow
                                                value={order.total}
                                                format={{
                                                    style: "currency",
                                                    currency: "AUD",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {order.products.length}{" "}
                                            {order.products.length === 1
                                                ? "item"
                                                : "items"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </main>

            <OrderDialog
                order={selectedOrder}
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
            />
        </>
    );
}

export default OrdersPage;
