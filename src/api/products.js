import api from "../lib/axios";

export const productsApi = {
    // Fetches products with optional filtering and pagination
    // params can include: page, limit, category, sort, search
    // Returns: { items: Product[], totalItems: number, totalPages: number, currentPage: number }
    getProducts: async (params) => {
        console.log('API call params:', params);
        // Support all query parameters: type, search, price-min, price-max, in-stock, sort, order
        const { data } = await api.get("/products", { 
            params: {
                type: params.category,
                search: params.search,
                'price-min': params.priceMin,
                'price-max': params.priceMax,
                'in-stock': params.inStock,
                sort: params.sort,
                order: params.order
            }
        });
        console.log('Raw API response:', data);
        return data;
    },

    // Fetches a single product by its ID
    // Returns: { id, title, artist, price, imageUrl, category, condition, inStock, createdAt }
    getProduct: async (id) => {
        try {
            const { data } = await api.get(`/products/${id}`);
            if (!data || !data.product) {
                throw new Error('Product not found');
            }
            return data.product;
        } catch (error) {
            // Log the full error for debugging
            console.error('API getProduct error:', {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            });
            throw error;
        }
    },

    // Searches products by query string
    // Returns paginated product results matching the search query
    searchProducts: async (query) => {
        const { data } = await api.get("/products/search", {
            params: { query },
        });
        return data;
    },

    // Fetches products filtered by category
    // Returns paginated product results for the specified category
    getProductsByCategory: async (category) => {
        const { data } = await api.get(`/products/category/${category}`);
        return data;
    },
};
