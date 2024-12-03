import api from "../lib/axios";

export const productsApi = {
	// Fetches products with optional filtering and pagination
	// params can include: page, limit, category, sort, search
	// Returns: { items: Product[], totalItems: number, totalPages: number, currentPage: number }
	getProducts: async (params) => {
		const { data } = await api.get("/products", { params });
		return data;
	},

	// Fetches a single product by its ID
	// Returns: { id, title, artist, price, imageUrl, category, condition, inStock, createdAt }
	getProduct: async (id) => {
		const { data } = await api.get(`/products/${id}`);
		return data;
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
