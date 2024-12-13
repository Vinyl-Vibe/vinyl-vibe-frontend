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
    PRICE_LOW: { sort: "price", order: "asc" },
    PRICE_HIGH: { sort: "price", order: "desc" },
    NEWEST: { sort: "createdAt", order: "desc" },
    NAME_AZ: { sort: "name", order: "asc" },
    NAME_ZA: { sort: "name", order: "desc" },
};

export const useProductStore = create((set, get) => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    activeCategory: CATEGORIES.ALL,
    sortBy: 'NEWEST',
    scrollPosition: 0,
    hasLoaded: false,
    page: 1,
    pageSize: 12,
    totalPages: 1,
    totalProducts: 0,

    setCategory: (category) => {
        set({
            activeCategory: category,
            page: 1, // Reset to first page when changing category
        });
        get().fetchProducts(); // Fetch new results immediately
    },

    setSortBy: (sortOption) => {
        set({
            sortBy: sortOption,
            page: 1, // Reset to first page when changing sort
        });
        get().fetchProducts(); // Fetch new results immediately
    },

    setPage: (page) => {
        set({ page });
        get().fetchProducts(); // Fetch new results immediately
    },

    // Remove getFilteredProducts as filtering is now done server-side

    fetchProducts: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const { sortBy, activeCategory, page, pageSize } = get();
            const sortOption = SORT_OPTIONS[sortBy];
            
            const { products, pagination } = await productsApi.getProducts({
                page,
                limit: pageSize,
                type: activeCategory === CATEGORIES.ALL ? undefined : activeCategory.toLowerCase(),
                sort: sortOption?.sort,
                order: sortOption?.order,
                ...params
            });

            console.log('API Response:', { products, pagination });

            set({
                products: products || [],
                totalPages: pagination.totalPages || 1,
                totalProducts: pagination.totalProducts || 0,
                page: pagination.currentPage || 1,
                pageSize: pagination.productsPerPage || 12,
                hasLoaded: true,
                isLoading: false,
            });
        } catch (err) {
            console.error('Product fetch error:', err);
            const apiError = handleApiError(err);
            set({ error: apiError.message, isLoading: false });
        }
    },

    // Fetch single product
    fetchProduct: async (id) => {
        set({ isLoading: true, error: null, currentProduct: null });
        try {
            if (!id) {
                throw new Error('Product ID is required');
            }
            const product = await productsApi.getProduct(id);
            if (!product) {
                throw new Error('Product not found');
            }
            set({ currentProduct: product, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch product:', error);
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
        // Use the same mock data for now
        return get().fetchProducts();
    },
}));
