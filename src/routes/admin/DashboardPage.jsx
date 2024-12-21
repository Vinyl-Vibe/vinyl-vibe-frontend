import { useEffect } from "react";
import { useStoreManagement } from "../../store/store-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BarChart,
    Activity,
    ArrowRight,
    ArrowUp,
    Box,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import NumberFlow from "@number-flow/react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const {
        stats,
        recentOrders,
        topCustomers,
        error,
        fetchDashboardData,
        isLoading,
    } = useStoreManagement();

    console.log("Dashboard Stats:", {
        totalSales: {
            raw: stats?.totalSales,
            asNumber: Number(stats?.totalSales),
            type: typeof stats?.totalSales,
        },
        totalOrders: {
            raw: stats?.totalOrders,
            asNumber: Number(stats?.totalOrders),
            type: typeof stats?.totalOrders,
        },
    });

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (!stats) return <div>Loading...</div>;

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main className="flex flex-col space-y-4 p-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Sales
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="pb-3 text-2xl font-medium">
                            <NumberFlow
                                value={stats.totalSales}
                                prefix="$"
                                decimalPlaces={2}
                            />
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                stats.totalSalesToday > 0
                                    ? "bg-green-100 text-green-800"
                                    : stats.totalSalesToday === 0
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                            }`}
                        >
                            {stats.totalSalesToday > 0 ? "+" : ""} ${" "}
                            <NumberFlow
                                value={stats.totalSalesToday}
                                decimalPlaces={2}
                            />
                            <span className="ml-1">today</span>
                        </span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Orders
                        </CardTitle>
                        <Box className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="pb-3 text-2xl font-medium">
                            <NumberFlow value={stats.totalOrders} />
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                stats.totalOrdersToday > 0
                                    ? "bg-green-100 text-green-800"
                                    : stats.totalOrdersToday === 0
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                            }`}
                        >
                            {stats.totalOrdersToday > 0 ? "+" : ""}{" "}
                            <NumberFlow value={stats.totalOrdersToday} />
                            <span className="ml-1">today</span>
                        </span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="pb-3 text-2xl font-medium">
                            <NumberFlow value={stats.totalCustomers} />
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                stats.totalCustomersToday > 0
                                    ? "bg-green-100 text-green-800"
                                    : stats.totalCustomersToday === 0
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                            }`}
                        >
                            {stats.totalCustomersToday > 0 ? "+" : ""}{" "}
                            <NumberFlow value={stats.totalCustomersToday} />
                            <span className="ml-1">today</span>
                        </span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Abandoned Carts
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="pb-3 text-2xl font-medium">
                            <NumberFlow
                                value={stats.totalAbandonedCarts}
                                prefix="$"
                                decimalPlaces={2}
                            />
                        </div>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                stats.totalAbandonedCartsToday > 0
                                    ? "bg-red-100 text-red-800"
                                    : stats.totalAbandonedCartsToday === 0
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-green-100 text-green-800"
                            }`}
                        >
                            {stats.totalAbandonedCartsToday > 0 ? "+ $" : ""}{" "}
                            <NumberFlow
                                value={stats.totalAbandonedCartsToday}
                                decimalPlaces={2}
                            />
                            <span className="ml-1">today</span>
                        </span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader className="pb-5 flex justify-between items-center flex-row">
                        <CardTitle className="text-xl">Recent orders</CardTitle>
                        <Link to="/admin/orders">
                            <Button variant="" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <Separator />
                    <CardContent className="flex-1 overflow-auto pt-6">
                        <ScrollArea>
                            <div className="space-y-8">
                                {isLoading ? (
                                    // Recent Orders Skeleton
                                    Array(10)
                                        .fill(0)
                                        .map((_, i) => (
                                            <div
                                                key={i}
                                                className="flex h-10 items-center justify-between"
                                            >
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-[120px]" />
                                                    <Skeleton className="h-3 w-[140px]" />
                                                </div>
                                                <Skeleton className="h-4 w-[60px]" />
                                            </div>
                                        ))
                                ) : recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex h-10 items-center justify-between"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {order.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.email}
                                                </p>
                                            </div>
                                            <div className="">
                                                ${order.amount}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Empty state
                                    <div className="flex h-10 items-center justify-center text-sm text-muted-foreground">
                                        No recent orders
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader className="pb-5 flex justify-between items-center flex-row">
                        <CardTitle className="text-xl">Top Customers</CardTitle>
                        <Link to="/admin/customers">
                            <Button variant="" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <Separator />
                    <CardContent className="flex-1 overflow-auto pt-6">
                        <div className="space-y-8">
                            {isLoading ? (
                                // Top Customers Skeleton
                                Array(10)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex h-10 items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-[120px]" />
                                                    <Skeleton className="h-3 w-[140px]" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-4 w-[60px]" />
                                        </div>
                                    ))
                            ) : topCustomers.length > 0 ? (
                                topCustomers.map((customer) => (
                                    <div
                                        key={customer.email}
                                        className="flex h-10 items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src="/placeholder.svg" />
                                                <AvatarFallback>
                                                    {customer.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {customer.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="">
                                            ${customer.amount}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Empty state
                                <div className="flex h-10 items-center justify-center text-sm text-muted-foreground">
                                    No top customers
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
