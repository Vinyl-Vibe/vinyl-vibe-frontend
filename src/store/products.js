import { create } from "zustand";
import { productsApi } from "../api/products";
import { handleApiError } from "../lib/api-errors";

export const CATEGORIES = {
    ALL: "all",
    VINYL: "vinyl",
    TURNTABLES: "turntable",
    ACCESSORIES: "accessory",
    MERCH: "merch",
};

export const SORT_OPTIONS = {
    PRICE_LOW: "price-asc",
    PRICE_HIGH: "price-desc",
    NEWEST: "newest",
    OLDEST: "oldest",
    NAME_AZ: "name-asc",
    NAME_ZA: "name-desc",
};

export const useProductStore = create((set, get) => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    activeCategory: CATEGORIES.ALL,
    sortBy: "NEWEST",
    scrollPosition: 0,
    hasLoaded: false,
    page: 1,
    pageSize: 12,
    totalPages: 1,
    totalProducts: 0,
    searchQuery: null,
    priceRange: {
        min: null,
        max: null,
    },
    inStock: null,

    setCategory: (category) => {
        set({
            activeCategory: category,
            page: 1,
        });
    },

    setSortBy: (sortOption) => {
        set({
            sortBy: sortOption,
            page: 1, // Reset to first page when changing sort
        });
        get().fetchProducts(); // Fetch new results immediately
    },

    setPage: (newPage) => {
        set({ page: newPage });
    },

    // Remove getFilteredProducts as filtering is now done server-side

    fetchProducts: async (params = {}) => {
        // Clear products before fetching new ones
        set({
            isLoading: true,
            error: null,
            products: [], // Clear products immediately
        });

        try {
            const queryParams = {
                page: params.page || 1,
                limit: 12,
            };

            // Add type filter
            if (params.type) {
                queryParams.type = params.type;
            }

            // Add sort parameter
            if (params.sort) {
                queryParams.sort = params.sort;
            }

            // Add search parameter if it exists
            if (params.search) {
                queryParams.search = params.search;
            }

            console.log("Sending API request with params:", queryParams);

            const { products, pagination } =
                await productsApi.getProducts(queryParams);

            // Update store with pagination data
            set({
                products: products || [],
                totalPages: pagination?.totalPages || 1,
                totalProducts: pagination?.totalProducts || 0,
                page: pagination?.currentPage || 1,
                pageSize: 12,
                hasLoaded: true,
                isLoading: false,
            });
        } catch (err) {
            console.error("Product fetch error:", err);
            set({
                error: handleApiError(err),
                isLoading: false,
                products: [],
            });
        }
    },

    // Fetch single product
    fetchProduct: async (id) => {
        set({ isLoading: true, error: null, currentProduct: null });
        try {
            if (!id) {
                throw new Error("Product ID is required");
            }
            const product = await productsApi.getProduct(id);
            if (!product) {
                throw new Error("Product not found");
            }
            set({ currentProduct: product, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch product:", error);
            let errorMessage = "Failed to fetch product";
            if (error.response?.status === 404) {
                errorMessage = "Product not found";
            } else if (error.response?.status === 500) {
                errorMessage = "Server error. Please try again later.";
            }
            set({
                error: error.response?.data?.message || errorMessage,
                isLoading: false,
            });
        }
    },

    // Add method to force refresh products
    refreshProducts: async () => {
        const { fetchProducts } = get();
        set({ page: 1 }); // Reset to first page
        await fetchProducts();
    },

    // Add new actions for filters
    setPriceRange: (min, max) => {
        set({
            priceRange: { min, max },
            page: 1, // Reset page when filter changes
        });
        get().fetchProducts();
    },

    setInStock: (inStock) => {
        set({
            inStock,
            page: 1, // Reset page when filter changes
        });
        get().fetchProducts();
    },

    // Update resetFilters
    resetFilters: () => {
        set({
            searchQuery: null,
            activeCategory: CATEGORIES.ALL,
            sortBy: "newest",
            page: 1,
            priceRange: { min: null, max: null },
            inStock: null,
        });
    },

    setProducts: (products) => {
        set({ products });
    },
}));
