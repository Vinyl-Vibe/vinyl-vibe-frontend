import api from "../lib/axios";

export const storeManagementApi = {
    // Get all orders
    getOrders: async ({ page = 1, limit = 50, isFiltering = false } = {}) => {
        // Get all orders if searching or filtering by status
        if (isFiltering) {
            const { data } = await api.get("/orders");
            return data;
        }
        const { data } = await api.get(`/orders?page=${page}&limit=${limit}`);
        return data;
    },

    // Get all users
    getUsers: async () => {
        const { data } = await api.get("/users");
        return data;
    },

    // Get all carts
    getCarts: async () => {
        const { data } = await api.get("/carts");
        return data;
    },

    // Get all products
    getProducts: async ({ page = 1, limit = 50 } = {}) => {
        const { data } = await api.get(`/products?page=${page}&limit=${limit}`);
        return data;
    },

    // Create a new product
    createProduct: async (productData) => {
        const { data } = await api.post("/products", productData);
        return data;
    },

    // Update a product
    updateProduct: async (productId, productData) => {
        const { data } = await api.patch(`/products/${productId}`, productData);
        return data;
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        const { data } = await api.patch(`/orders/${orderId}`, { status });
        return data;
    },

    // Get orders for a specific customer
    getCustomerOrders: async (customerId) => {
        const { data } = await api.get(`/orders?user-id=${customerId}`);
        return data;
    },
};
