import { useState, useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useNavigate } from 'react-router-dom'
import { useStoreManagement } from "@/store/store-management"

export default function AdminCustomerSheet({ customer, open, onOpenChange }) {
    const navigate = useNavigate()
    const { getCustomerOrders } = useStoreManagement()
    const [customerOrders, setCustomerOrders] = useState([])
    const [currentCustomer, setCurrentCustomer] = useState(null)
    const [stats, setStats] = useState({
        totalSpent: 0,
        totalOrders: 0,
        totalItems: 0,
        averageOrderValue: 0,
        lastOrderDate: null
    })

    // Update currentCustomer when customer prop changes
    useEffect(() => {
        if (customer) {
            setCurrentCustomer(customer)
        }
    }, [customer])

    // Fetch customer orders when sheet opens
    useEffect(() => {
        if (currentCustomer && open) {
            const fetchOrders = async () => {
                const orders = await getCustomerOrders(currentCustomer._id)
                setCustomerOrders(orders)
                
                // Calculate stats
                const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
                const totalItems = orders.reduce((sum, order) => 
                    sum + order.products.reduce((itemSum, product) => itemSum + product.quantity, 0), 0)
                const lastOrder = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                
                setStats({
                    totalSpent,
                    totalOrders: orders.length,
                    totalItems,
                    averageOrderValue: orders.length ? totalSpent / orders.length : 0,
                    lastOrderDate: lastOrder?.createdAt
                })
            }
            fetchOrders()
        }
    }, [currentCustomer, open, getCustomerOrders])

    // Handle sheet closing
    const handleSheetClose = (open) => {
        if (!open) {
            setCurrentCustomer(null)
            setCustomerOrders([])
            setStats({
                totalSpent: 0,
                totalOrders: 0,
                totalItems: 0,
                averageOrderValue: 0,
                lastOrderDate: null
            })
        }
        onOpenChange(open)
    }

    return (
        <Sheet open={open} onOpenChange={handleSheetClose}>
            <SheetContent className="flex flex-col sm:max-w-[540px]">
                {currentCustomer ? (
                    <>
                        <SheetHeader className="space-y-1">
                            <SheetTitle>Customer Details</SheetTitle>
                            <SheetDescription>
                                {currentCustomer.email}
                            </SheetDescription>
                        </SheetHeader>
                        <Separator className="my-4" />
                        
                        <ScrollArea className="flex-1 pr-4">
                            {/* Customer Info */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">Personal Information</h4>
                                    <div className="text-sm">
                                        <p>Name: {currentCustomer.profile?.firstName} {currentCustomer.profile?.lastName}</p>
                                        <p>Phone: {currentCustomer.profile?.phoneNumber || 'N/A'}</p>
                                        <p>Member since: {format(new Date(currentCustomer.createdAt), 'PPP')}</p>
                                    </div>
                                </div>

                                {/* Address */}
                                {currentCustomer.profile?.address && (
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">Address</h4>
                                        <div className="text-sm">
                                            <p>{currentCustomer.profile.address.street}</p>
                                            <p>
                                                {currentCustomer.profile.address.city}, {currentCustomer.profile.address.state}
                                            </p>
                                            <p>{currentCustomer.profile.address.postalCode}</p>
                                            <p>{currentCustomer.profile.address.country}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Customer Stats */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">Customer Stats</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="rounded-lg border p-3">
                                            <p className="text-muted-foreground">Total Spent</p>
                                            <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <p className="text-muted-foreground">Orders</p>
                                            <p className="text-2xl font-bold">{stats.totalOrders}</p>
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <p className="text-muted-foreground">Items Bought</p>
                                            <p className="text-2xl font-bold">{stats.totalItems}</p>
                                        </div>
                                        <div className="rounded-lg border p-3">
                                            <p className="text-muted-foreground">Avg. Order</p>
                                            <p className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order History */}
                                <div>
                                    <h4 className="mb-2 text-sm font-medium">Order History</h4>
                                    <div className="space-y-4">
                                        {customerOrders.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    This customer hasn't placed any orders yet
                                                </p>
                                            </div>
                                        ) : (
                                            customerOrders.map(order => (
                                                <div 
                                                    key={order._id} 
                                                    className="flex items-center justify-between rounded-lg border p-4"
                                                >
                                                    <div>
                                                        <p className="font-medium">Order #{order._id}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(new Date(order.createdAt), 'PPP')}
                                                        </p>
                                                        <p className="text-sm">${order.total.toFixed(2)}</p>
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
                                                    </div>
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => {
                                                            navigate(`/admin/orders?orderId=${order._id}`)
                                                            onOpenChange(false)
                                                        }}
                                                    >
                                                        View Order
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </>
                ) : null}
            </SheetContent>
        </Sheet>
    )
} 