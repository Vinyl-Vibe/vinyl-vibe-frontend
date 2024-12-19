import api from '../lib/axios'

export const ordersApi = {
    // Create new order and get Stripe checkout URL
    createOrder: async (products) => {
        const { data } = await api.post('/orders', { products })
        return data
    },

    // Get current user's orders
    getMyOrders: async () => {
        const { data } = await api.get('/orders/me')
        return data
    },

    // Get single order details (backend handles permissions)
    getOrderDetails: async (orderId) => {
        const { data } = await api.get(`/orders/${orderId}`)
        return data
    },

    // Update order (backend handles permissions)
    updateOrder: async (orderId, updateData) => {
        const { data } = await api.patch(`/orders/${orderId}`, updateData)
        return data
    }

    // Admin-only methods will be in a separate admin API file
} 