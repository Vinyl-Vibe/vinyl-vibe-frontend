import api from "../lib/axios";

export const cartApi = {
    // Get cart contents
    getCart: async () => {
        const { data } = await api.get("/carts/me");
        return data;
    },

    // Add item to cart
    addItem: async (productId, quantity) => {
        const { data } = await api.post("/carts", {
            productId,
            quantity,
        });
        return data;
    },

    // Update item quantity
    updateQuantity: async (productId, quantity) => {

        const { data } = await api.put(`/carts/${productId}`, {
            quantity,
        });
        return data;
    },

    // Remove item from cart
    removeItem: async (productId) => {
        const { data } = await api.delete(`/carts/${productId}`);
        return data;
    },
};
