import { useEffect, useState } from "react";
import { useStoreManagement } from "../../store/store-management";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Search, ArrowUpDown, X } from "lucide-react";
import { SortButton } from "@/components/ui/sort-button";
import AdminCustomerSheet from "@/components/customers/AdminCustomerSheet";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminCustomersPage() {
    const { customers, isLoading, error, fetchCustomers } =
        useStoreManagement();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [sortDirection, setSortDirection] = useState({
        joined: "none",
        orders: "none",
    });

    useEffect(() => {
        fetchCustomers({ isFiltering: Boolean(searchQuery) });
    }, [fetchCustomers, searchQuery]);

    useEffect(() => {
        if (!customers) return;

        let result = [...customers];

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            result = result.filter(
                (customer) =>
                    customer.email.toLowerCase().includes(searchLower) ||
                    customer.profile?.firstName
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    customer.profile?.lastName
                        ?.toLowerCase()
                        .includes(searchLower),
            );
        }

        setFilteredCustomers(result);
    }, [customers, searchQuery]);

    const toggleSort = (field) => {
        setSortDirection((prev) => {
            const newDirection =
                prev[field] === "none"
                    ? "asc"
                    : prev[field] === "asc"
                      ? "desc"
                      : "none";

            return Object.keys(prev).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: key === field ? newDirection : "none",
                }),
                {},
            );
        });

        let sorted = [...filteredCustomers];

        if (field === "joined") {
            sorted.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sortDirection.joined === "asc"
                    ? dateB - dateA
                    : dateA - dateB;
            });
        }

        if (field === "orders") {
            sorted.sort((a, b) => {
                const ordersA = a.orderCount || 0;
                const ordersB = b.orderCount || 0;
                return sortDirection.orders === "asc"
                    ? ordersB - ordersA
                    : ordersA - ordersB;
            });
        }

        setFilteredCustomers(sorted);
    };

    if (error) return <div>Error: {error}</div>;

    const customersList = filteredCustomers || [];

    return (
        <div className="flex-1 space-y-4 p-4 pt-6">
            <Card className="rounded-2xl">
                <CardHeader>
                    <div className="space-y-1.5">
                        <CardTitle className="text-3xl font-medium">
                            Customers
                        </CardTitle>
                        <CardDescription>
                            View and manage your customer base
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                className="rounded-xl pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">
                                        Clear search
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Customers Table */}
                    {isLoading && !customers.length ? (
                        <TableSkeleton rowCount={8} />
                    ) : customersList.length > 0 ? (
                        <div className="rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>
                                            <SortButton
                                                label="Joined"
                                                direction={sortDirection.joined}
                                                onClick={() =>
                                                    toggleSort("joined")
                                                }
                                            />
                                        </TableHead>
                                        <TableHead>
                                            <SortButton
                                                label="Orders"
                                                direction={sortDirection.orders}
                                                onClick={() =>
                                                    toggleSort("orders")
                                                }
                                            />
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customersList.map((customer) => (
                                        <TableRow key={customer._id}>
                                            <TableCell className="font-medium">
                                                {customer.profile?.firstName}{" "}
                                                {customer.profile?.lastName}
                                            </TableCell>
                                            <TableCell>
                                                {customer.email}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(
                                                        customer.createdAt,
                                                    ),
                                                    "MMM d, yyyy",
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {customer.orderCount || 0}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant=""
                                                    size="sm"
                                                    onClick={() =>
                                                        setSelectedCustomer(
                                                            customer,
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {customersList.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                {searchQuery
                                                    ? "No customers match your search."
                                                    : "No customers found."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyState
                            type={searchQuery ? "search" : "customers"}
                        />
                    )}
                </CardContent>
            </Card>

            <AdminCustomerSheet
                customer={selectedCustomer}
                open={!!selectedCustomer}
                onOpenChange={(open) => {
                    if (!open) setSelectedCustomer(null);
                }}
            />
        </div>
    );
}
