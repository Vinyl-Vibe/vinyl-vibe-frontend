import { useEffect, useState } from "react"
import { useStoreManagement } from "../../store/store-management"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { Search, ArrowUpDown } from "lucide-react"
import AdminCustomerSheet from '@/components/customers/AdminCustomerSheet'

export default function AdminCustomersPage() {
    const { customers, isLoading, error, fetchCustomers } = useStoreManagement()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    if (error) return <div>Error: {error}</div>

    const customersList = customers || []

    return (
        <div className="py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>
                        View and manage your customer base
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Customers Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customersList.map(customer => (
                                    <TableRow key={customer._id}>
                                        <TableCell className="font-medium">
                                            {customer.profile?.firstName}{" "}
                                            {customer.profile?.lastName}
                                        </TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(customer.createdAt),
                                                "MMM d, yyyy"
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
                                                    setSelectedCustomer(customer)
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
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AdminCustomerSheet 
                customer={selectedCustomer}
                open={!!selectedCustomer}
                onOpenChange={(open) => {
                    if (!open) setSelectedCustomer(null)
                }}
            />
        </div>
    )
} 