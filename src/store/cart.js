import { create } from "zustand";
import { cartApi } from "../api/cart";
import { productsApi } from "../api/products";
import { tokenStorage } from "../lib/token";

/* 
    Cart Store: Manages cart state and operations
    - Handles both authenticated and guest carts
    - Syncs local storage cart with server on login
    - Provides cart operations (add, remove, update)
*/
export const useCartStore = create((set, get) => ({
    items: [],
    isLoading: false,
    error: null,
    total: 0,
    updateTimeouts: {}, // Object to store timeouts for each product

    // Add error handling
    setError: (error) => {
        set({ error });
        // Clear error after 5 seconds
        setTimeout(() => {
            set({ error: null });
        }, 5000);
    },

    // Helper to fetch product details for cart items
    enrichCartItems: async (cartItems) => {
        if (!Array.isArray(cartItems)) {
            console.warn("Invalid cart items format:", cartItems);
            return [];
        }

        try {
            const enrichedItems = await Promise.all(
                cartItems.map(async (item) => {
                    if (!item?.productId) {
                        console.warn("Invalid cart item:", item);
                        return null;
                    }

                    try {
                        const product = await productsApi.getProduct(
                            item.productId,
                        );
                        return {
                            ...item,
                            product,
                        };
                    } catch (err) {
                        console.error(
                            `Failed to fetch product ${item.productId}:`,
                            err,
                        );
                        return null;
                    }
                }),
            );
            // Filter out any null items from failed product fetches
            return enrichedItems.filter(Boolean);
        } catch (err) {
            console.error("Failed to enrich cart items:", err);
            return [];
        }
    },

    // Helper to format cart items from server response
    formatServerCart: (serverResponse) => {
        // Handle both single cart and multiple carts responses
        const cart = serverResponse?.cart || serverResponse?.carts?.[0];
        if (!cart) return [];
        
        const products = cart.products || [];
        return products.map((item) => ({
            productId: item.product?.id,
            quantity: item.quantity,
            // Include product details directly since they're in the response
            product: {
                _id: item.product?.id,
                name: item.product?.name,
                price: item.product?.price,
                type: item.product?.type,
                thumbnail: item.product?.thumbnail || '',
            },
        }));
    },

    // Initialize cart - called on app load
    initCart: async () => {
        set({ isLoading: true });
        try {
            let cartItems = [];
            if (tokenStorage.isValid()) {
                // Logged in - get cart from server
                const response = await cartApi.getCart();
                cartItems = get().formatServerCart(response);
                set({ items: cartItems, isLoading: false });
            } else {
                // Guest - get cart from localStorage
                const localCart = localStorage.getItem("cart");
                try {
                    cartItems = localCart ? JSON.parse(localCart) : [];
                    if (!Array.isArray(cartItems)) {
                        console.warn("Invalid local cart format:", localCart);
                        cartItems = [];
                    }
                } catch (err) {
                    console.error("Failed to parse local cart:", err);
                    cartItems = [];
                }
            }

            // Enrich cart items with product details
            const enrichedItems = await get().enrichCartItems(cartItems);
            set({ items: enrichedItems, isLoading: false });
        } catch (err) {
            console.error("Failed to init cart:", err);
            set({ error: err.message, isLoading: false, items: [] });
        }
    },

    // Add item to cart
    addItem: async (productId, quantity = 1) => {

        set({ isLoading: true, error: null });
        try {
            if (tokenStorage.isValid()) {
                // Logged in - add to server
                const response = await cartApi.addItem(productId, quantity);

                const cartItems = get().formatServerCart(response);

                const enrichedItems = await get().enrichCartItems(cartItems);

                set({ items: enrichedItems, isLoading: false });
            } else {
                // Guest - add to localStorage
                const currentItems = get().items;
                const existingItem = currentItems.find(
                    (item) => item.productId === productId,
                );

                let newItems;
                if (existingItem) {
                    newItems = currentItems.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + quantity }
                            : item,
                    );
                } else {
                    // Fetch product details for new item
                    const product = await productsApi.getProduct(productId);
                    newItems = [
                        ...currentItems,
                        { productId, quantity, product },
                    ];
                }

                // Save to localStorage without product details
                localStorage.setItem(
                    "cart",
                    JSON.stringify(
                        newItems.map(({ product, ...item }) => item),
                    ),
                );

                set({ items: newItems, isLoading: false });
            }
        } catch (err) {
            console.error("Failed to add item:", err);
            set({ error: err.message, isLoading: false });
        }
    },

    // Update item quantity
    updateQuantity: async (productId, quantity) => {
        set({ isLoading: true, error: null });
        try {
            if (tokenStorage.isValid()) {
                // Logged in - update on server
                const response = await cartApi.updateQuantity(
                    productId,
                    quantity,
                );
                const cartItems = get().formatServerCart(response);
                set({ items: cartItems, isLoading: false });
            } else {
                // Guest - update in localStorage
                const currentItems = get().items;
                const newItems = currentItems.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item,
                );
                localStorage.setItem(
                    "cart",
                    JSON.stringify(
                        newItems.map(({ product, ...item }) => item),
                    ),
                );
                set({ items: newItems, isLoading: false });
            }
        } catch (err) {
            console.error("Failed to update quantity:", err);
            set({ error: err.message, isLoading: false });
        }
    },

    // Remove item from cart
    removeItem: async (productId) => {
        set({ isLoading: true, error: null });
        try {
            if (tokenStorage.isValid()) {
                // Logged in - remove from server
                const response = await cartApi.removeItem(productId);
                const cartItems = get().formatServerCart(response);
                set({ items: cartItems, isLoading: false });
            } else {
                // Guest - remove from localStorage
                const newItems = get().items.filter(
                    (item) => item.productId !== productId,
                );
                localStorage.setItem("cart", JSON.stringify(newItems));
                set({ items: newItems, isLoading: false });
            }
        } catch (err) {
            console.error("Failed to remove item:", err);
            set({ error: err.message, isLoading: false });
        }
    },

    // Sync local cart with server on login
    syncCartOnLogin: async () => {
        set({ isLoading: true });
        try {
            const localCart = localStorage.getItem("cart");
            if (!localCart) {
                // No local cart, just get server cart
                const response = await cartApi.getCart();
                const cartItems = get().formatServerCart(response);
                set({ items: cartItems, isLoading: false });
                return;
            }

            // Parse local cart
            const localItems = JSON.parse(localCart);
            if (!Array.isArray(localItems) || localItems.length === 0) {
                localStorage.removeItem("cart");
                return;
            }

            // Upload each local item to server
            for (const item of localItems) {
                await cartApi.addItem(item.productId, item.quantity);
            }

            // Clear local storage
            localStorage.removeItem("cart");

            // Get updated cart from server
            const response = await cartApi.getCart();
            const cartItems = get().formatServerCart(response);
            set({ items: cartItems, isLoading: false });
        } catch (err) {
            console.error("Failed to sync cart:", err);
            set({ error: err.message, isLoading: false });
        }
    },

    // Clear cart (used on logout)
    clearCart: () => {
        set({
            items: [],
            total: 0,
            error: null,
        });
        // Also clear localStorage
        localStorage.removeItem("cart");
    },

    // Add a debounced update function
    debouncedUpdateQuantity: async (productId, quantity) => {
        if (!tokenStorage.isValid()) {
            // For guest cart, update immediately
            get().updateQuantity(productId, quantity);
            return;
        }

        // Clear existing timeout for this specific product
        const timeouts = get().updateTimeouts;
        if (timeouts[productId]) {
            clearTimeout(timeouts[productId]);
        }

        // Set optimistic update immediately
        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
        );
        set({ items: newItems });

        // Set new timeout for this specific product
        const timeout = setTimeout(async () => {
            try {
                const response = await cartApi.updateQuantity(
                    productId,
                    quantity,
                );
                const cartItems = get().formatServerCart(response);
                set({
                    items: cartItems,
                    updateTimeouts: {
                        ...get().updateTimeouts,
                        [productId]: undefined, // Clear the timeout reference
                    },
                });
            } catch (err) {
                console.error("Failed to update quantity:", err);
                set({
                    error: err.message,
                    items: currentItems,
                    updateTimeouts: {
                        ...get().updateTimeouts,
                        [productId]: undefined,
                    },
                });
            }
        }, 1000);

        // Store the timeout reference for this product
        set({
            updateTimeouts: {
                ...timeouts,
                [productId]: timeout,
            },
        });
    },
}));
