import api from "../lib/axios";

export const cartApi = {
    // Get cart contents
    getCart: async () => {
        console.log("Getting cart from server...");
        const { data } = await api.get("/carts/me");
        console.log("Server cart response:", data);
        return data;
    },

    // Add item to cart
    addItem: async (productId, quantity) => {
        console.log("Adding item to server cart:", { productId, quantity });
        const { data } = await api.post("/carts", {
            productId,
            quantity,
        });
        console.log("Server add item response:", data);
        return data;
    },

    // Update item quantity
    updateQuantity: async (productId, quantity) => {
        console.log("Updating quantity in server cart:", {
            productId,
            quantity,
        });
        const { data } = await api.put(`/carts/${productId}`, {
            quantity,
        });
        console.log("Server update quantity response:", data);
        return data;
    },

    // Remove item from cart
    removeItem: async (productId) => {
        console.log("Removing item from server cart:", productId);
        const { data } = await api.delete(`/carts/${productId}`);
        console.log("Server remove item response:", data);
        return data;
    },
};
