import { create } from "zustand";
import { productsApi } from "../api/products";
import { handleApiError } from "../lib/api-errors";

export const CATEGORIES = {
    ALL: "all",
    VINYL: "vinyl",
    TURNTABLES: "turntables",
    ACCESSORIES: "accessories",
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
    },

    setSortBy: (sortOption) => {
        set({
            sortBy: sortOption,
            page: 1, // Reset to first page when changing sort order
        });
    },

    saveScrollPosition: (position) => {
        set({ scrollPosition: position });
    },

    setPage: (page) => {
        set({ page });
    },

    // Reset store to default state
    resetFilters: () => {
        set({
            activeCategory: CATEGORIES.ALL,
            sortBy: 'NEWEST',
            page: 1,
            scrollPosition: 0,
        });
    },

    // Get filtered and sorted products
    getFilteredProducts: () => {
        const { products = [], activeCategory, sortBy, page, pageSize } = get();

        // First filter by category
        const filtered =
            activeCategory === CATEGORIES.ALL
                ? products
                : products.filter(
                      (product) => product.category === activeCategory,
                  );

        // Then sort
        const sorted = [...(filtered || [])].sort((a, b) => {
            const sortOption = SORT_OPTIONS[sortBy];
            if (!sortOption) return 0;

            const { sort, order } = sortOption;
            const multiplier = order === 'desc' ? -1 : 1;

            switch (sort) {
                case 'price':
                    return multiplier * (a.price - b.price);
                case 'createdAt':
                    return multiplier * (new Date(a.createdAt) - new Date(b.createdAt));
                case 'name':
                    return multiplier * a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        // Then paginate
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            items: sorted.slice(start, end),
            totalItems: sorted.length,
            totalPages: Math.ceil(sorted.length / pageSize),
        };
    },

    // Fetch products from API
    fetchProducts: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const { sortBy, activeCategory } = get();
            const sortOption = SORT_OPTIONS[sortBy];
            
            const data = await productsApi.getProducts({
                type: activeCategory === CATEGORIES.ALL ? undefined : activeCategory,
                sort: sortOption?.sort,
                order: sortOption?.order,
                ...params
            });

            set({
                products: data.products || [],
                totalPages: Math.ceil((data.products || []).length / get().pageSize),
                totalProducts: (data.products || []).length,
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
