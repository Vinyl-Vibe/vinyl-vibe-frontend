import { create } from "zustand";
import { storeManagementApi } from "../api/store-management";
import { startOfToday, isAfter, subHours } from "date-fns";

// Helper to format money values
const formatMoney = (amount) => {
    // Convert to number if it's a string
    const num = Number(amount);
    // Return 0 if not a valid number
    if (isNaN(num)) return 0;
    // If it's a whole number, return without decimals
    if (Number.isInteger(num)) return num;
    // Otherwise return with exactly 2 decimal places
    return Number(num.toFixed(2)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const useStoreManagement = create((set, get) => ({
    stats: {
        totalSales: 0,
        totalSalesToday: 0,
        totalOrders: 0,
        totalOrdersToday: 0,
        totalCustomers: 0,
        totalCustomersToday: 0,
        totalAbandonedCarts: 0,
        totalAbandonedCartsToday: 0,
    },
    recentOrders: [],
    topCustomers: [],
    orders: [],
    products: [],
    productsPage: 1,
    hasMoreProducts: true,
    isLoading: false,
    error: null,
    // Track pagination
    ordersPage: 1,
    hasMoreOrders: true,
    customers: [],

    // Calculate dashboard stats from raw data
    calculateStats: (orders, users, carts) => {
        const today = startOfToday();
        const oneHourAgo = subHours(new Date(), 1);

        // Calculate order stats
        const completedOrders = orders.filter(
            (order) => order.status !== "pending",
        );
        const todayOrders = completedOrders.filter((order) =>
            isAfter(new Date(order.createdAt), today),
        );

        // Calculate customer stats
        const todayCustomers = users.filter((user) =>
            isAfter(new Date(user.createdAt), today),
        );

        // Calculate abandoned carts
        const abandonedCarts = carts.filter(
            (cart) =>
                cart.products?.length > 0 &&
                !isAfter(new Date(cart.createdAt), oneHourAgo),
        );
        // Calculate total potential sales from abandoned carts
        const totalAbandonedValue = formatMoney(abandonedCarts.reduce((sum, cart) => {
            return sum + cart.products.reduce((cartSum, item) => {
                return cartSum + (item.product.price * item.quantity)
            }, 0)
        }, 0));
        
        const todayAbandonedValue = formatMoney(abandonedCarts
            .filter((cart) => isAfter(new Date(cart.createdAt), today))
            .reduce((sum, cart) => {
                return sum + cart.products.reduce((cartSum, item) => {
                    return cartSum + (item.product.price * item.quantity)
                }, 0)
            }, 0));

        // Calculate total sales
        const totalSales = formatMoney(completedOrders.reduce(
            (sum, order) => sum + order.total,
            0,
        ));
        const totalSalesToday = formatMoney(todayOrders.reduce(
            (sum, order) => sum + order.total,
            0,
        ));

        // Calculate top customers by total spend
        const customerSpending = completedOrders.reduce((acc, order) => {
            const userId = order.userId._id;
            acc[userId] = (acc[userId] || 0) + order.total;
            return acc;
        }, {});

        const topCustomers = Object.entries(customerSpending)
            .map(([userId, totalSpent]) => {
                const user = users.find((u) => u._id === userId);
                return {
                    name: user?.profile?.firstName
                        ? `${user.profile.firstName} ${user.profile.lastName || ""}`
                        : "Guest User",
                    email:
                        user?.email ||
                        orders.find((o) => o.userId._id === userId)?.userId.email ||
                        "Unknown",
                    amount: formatMoney(totalSpent),
                };
            })
            .sort((a, b) => customerSpending[b[0]] - customerSpending[a[0]])
            .slice(0, 5);

        return {
            stats: {
                totalSales,
                totalSalesToday,
                totalOrders: completedOrders.length,
                totalOrdersToday: todayOrders.length,
                totalCustomers: users.length,
                totalCustomersToday: todayCustomers.length,
                totalAbandonedCarts: totalAbandonedValue,
                totalAbandonedCartsToday: todayAbandonedValue,
            },
            recentOrders: completedOrders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((order) => ({
                    id: order._id,
                    name: "Guest User",
                    email: order.userId?.email || "Unknown",
                    amount: formatMoney(order.total),
                })),
            topCustomers,
        };
    },

    // Fetch all dashboard data
    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [ordersResponse, users, cartsResponse] = await Promise.all([
                storeManagementApi.getOrders(),
                storeManagementApi.getUsers(),
                storeManagementApi.getCarts(),
            ]);

            // Check if responses were successful and extract data
            if (ordersResponse.status !== "success") {
                throw new Error("Failed to fetch orders");
            }
            if (cartsResponse.status !== "success") {
                throw new Error("Failed to fetch carts");
            }

            const orders = ordersResponse.orders || [];
            const carts = cartsResponse.carts || [];

            const dashboardData = get().calculateStats(orders, users, carts);
            set(dashboardData);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            set({ error: "Failed to load dashboard data" });
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch all orders
    fetchOrders: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await storeManagementApi.getOrders({ 
                page: 1, 
                limit: 50 
            })
            if (response.status !== "success") {
                throw new Error("Failed to fetch orders")
            }
            set({ 
                orders: response.orders || [],
                ordersPage: 1,
                // If we got less than 50 orders, there are no more to load
                hasMoreOrders: (response.orders || []).length === 50
            })
        } catch (err) {
            console.error("Failed to fetch orders:", err)
            set({ error: "Failed to load orders" })
        } finally {
            set({ isLoading: false })
        }
    },

    // Load more orders
    loadMoreOrders: async () => {
        const nextPage = get().ordersPage + 1
        set({ isLoading: true, error: null })
        try {
            const response = await storeManagementApi.getOrders({ 
                page: nextPage, 
                limit: 50 
            })
            if (response.status !== "success") {
                throw new Error("Failed to fetch more orders")
            }
            const newOrders = response.orders || []
            set({ 
                // Append new orders to existing ones
                orders: [...get().orders, ...newOrders],
                ordersPage: nextPage,
                // If we got less than 50 orders, there are no more to load
                hasMoreOrders: newOrders.length === 50
            })
        } catch (err) {
            console.error("Failed to load more orders:", err)
            set({ error: "Failed to load more orders" })
        } finally {
            set({ isLoading: false })
        }
    },

    // Update fetchCustomers function to use storeManagementApi
    fetchCustomers: async () => {
        set({ isLoading: true, error: null })
        try {
            const [users, ordersResponse] = await Promise.all([
                storeManagementApi.getUsers(),
                storeManagementApi.getOrders()
            ])

            if (!users || !Array.isArray(users) || !ordersResponse.orders) {
                throw new Error("Invalid response format")
            }

            // Calculate order count for each user
            const orderCounts = ordersResponse.orders.reduce((acc, order) => {
                const userId = order.userId._id
                acc[userId] = (acc[userId] || 0) + 1
                return acc
            }, {})

            // Add order count to each user
            const usersWithOrderCount = users.map(user => ({
                ...user,
                orderCount: orderCounts[user._id] || 0
            }))

            set({ 
                customers: usersWithOrderCount,
                isLoading: false 
            })
        } catch (error) {
            console.error("Failed to fetch customers:", error)
            set({ 
                error: 'Failed to fetch customers',
                isLoading: false 
            })
        }
    },

    // Fetch all products with pagination
    fetchProducts: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await storeManagementApi.getProducts({ 
                page: 1, 
                limit: 50 
            })            
            if (!response.success || !Array.isArray(response.products)) {
                throw new Error("Invalid products data")
            }
            
            set({ 
                products: response.products,
                productsPage: 1,
                hasMoreProducts: response.products.length === 50,
                isLoading: false 
            })
        } catch (err) {
            console.error("Failed to fetch products:", err)
            set({ error: "Failed to load products" })
        } finally {
            set({ isLoading: false })
        }
    },

    // Load more products
    loadMoreProducts: async () => {
        const nextPage = get().productsPage + 1
        set({ isLoading: true, error: null })
        try {
            const response = await storeManagementApi.getProducts({ 
                page: nextPage, 
                limit: 50 
            })
            if (!response.success || !Array.isArray(response.products)) {
                throw new Error("Invalid products data")
            }
            const newProducts = response.products
            set({ 
                products: [...get().products, ...newProducts],
                productsPage: nextPage,
                hasMoreProducts: newProducts.length === 50,
                isLoading: false 
            })
        } catch (err) {
            console.error("Failed to load more products:", err)
            set({ error: "Failed to load more products" })
        } finally {
            set({ isLoading: false })
        }
    },

    // Update a product
    updateProduct: async (productId, productData) => {
        set({ isLoading: true, error: null })
        try {
            const response = await storeManagementApi.updateProduct(productId, productData)
            
            // Update the product in the local state
            const updatedProducts = get().products.map(product => 
                product._id === productId ? { ...product, ...productData } : product
            )
            
            set({ 
                products: updatedProducts,
                isLoading: false 
            })
            
            return { success: true }
        } catch (err) {
            console.error("Failed to update product:", err)
            set({ 
                error: "Failed to update product",
                isLoading: false 
            })
            return { success: false, error: err.message }
        }
    },

    // Create a new product
    createProduct: async (productData) => {
        set({ isLoading: true, error: null })
        try {
            const response = await storeManagementApi.createProduct(productData)
            
            // Add the new product to the local state
            set({ 
                products: [response.product, ...get().products],
                isLoading: false 
            })
            
            return { success: true }
        } catch (err) {
            console.error("Failed to create product:", err)
            set({ 
                error: "Failed to create product",
                isLoading: false 
            })
            return { success: false, error: err.message }
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await storeManagementApi.updateOrderStatus(orderId, status)
            
            // Update the order in the local state
            const updatedOrders = get().orders.map(order => 
                order._id === orderId ? { ...order, status } : order
            )
            
            set({ orders: updatedOrders })
            
            return { success: true }
        } catch (err) {
            console.error("Failed to update order status:", err)
            return { success: false, error: err.message }
        }
    },

    // Get orders for a specific customer
    getCustomerOrders: async (customerId) => {
        try {
            const response = await storeManagementApi.getCustomerOrders(customerId)
            // Filter orders to only include those belonging to this customer
            const customerOrders = (response.orders || []).filter(order => 
                order.userId._id === customerId
            )
            return customerOrders
        } catch (err) {
            console.error("Failed to fetch customer orders:", err)
            return []
        }
    },
}));
