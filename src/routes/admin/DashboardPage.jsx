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

export default function DashboardPage() {
    const {
        stats,
        recentOrders,
        topCustomers,
        error,
        fetchDashboardData,
    } = useStoreManagement();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
            <main className="flex-1 space-y-4 py-8 pt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
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
                            <div className="text-2xl font-bold">
                                ${stats.totalSales}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                + ${stats.totalSalesToday} today
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Orders
                            </CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalOrders}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                + {stats.totalOrdersToday} today
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Customers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalCustomers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                + {stats.totalCustomersToday} today
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Abandoned Carts
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalAbandonedCarts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                + {stats.totalAbandonedCartsToday} today
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Orders</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Recent orders from your store.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                                asChild
                            >
                                <Link to="/admin/orders">
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {order.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.email}
                                            </p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            ${order.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Customers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {topCustomers.map((customer) => (
                                    <div
                                        key={customer.email}
                                        className="flex items-center justify-between"
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
                                        <div className="text-sm font-medium">
                                            ${customer.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
    );
}
