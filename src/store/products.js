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
	PRICE_LOW: "price-low",
	PRICE_HIGH: "price-high",
	NEWEST: "newest",
	TITLE_AZ: "title-az",
	TITLE_ZA: "title-za",
};

export const useProductStore = create((set, get) => ({
	products: [],
	currentProduct: null,
	isLoading: false,
	error: null,
	activeCategory: CATEGORIES.ALL,
	sortBy: SORT_OPTIONS.NEWEST,
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
			sortBy: SORT_OPTIONS.NEWEST,
			page: 1,
			scrollPosition: 0,
		});
	},

	// Get filtered and sorted products
	getFilteredProducts: () => {
		const { products, activeCategory, sortBy, page, pageSize } = get();

		// First filter by category
		const filtered =
			activeCategory === CATEGORIES.ALL
				? products
				: products.filter(
						(product) => product.category === activeCategory
				  );

		// Then sort
		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case SORT_OPTIONS.PRICE_LOW:
					return a.price - b.price;
				case SORT_OPTIONS.PRICE_HIGH:
					return b.price - a.price;
				case SORT_OPTIONS.NEWEST:
					return new Date(b.createdAt) - new Date(a.createdAt);
				case SORT_OPTIONS.TITLE_AZ:
					return a.title.localeCompare(b.title);
				case SORT_OPTIONS.TITLE_ZA:
					return b.title.localeCompare(a.title);
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

	// Fetch products (currently mock data)
	fetchProducts: async (params) => {
		set({ isLoading: true, error: null });
		try {
			const data = await productsApi.getProducts(params);
			set({
				products: data.items,
				totalPages: data.totalPages,
				totalItems: data.totalItems,
				hasLoaded: true,
				isLoading: false,
			});
		} catch (err) {
			const apiError = handleApiError(err);
			set({ error: apiError.message, isLoading: false });
		}
	},

	// Get single product (currently mock data)
	getProduct: (id) => {
		const { products } = useProductStore.getState();
		return products.find((product) => product.id === id);
	},

	// Fetch single product
	fetchProduct: async (id) => {
		set({ isLoading: true, error: null, currentProduct: null });
		try {
			// In development, get from cached products
			const product =
				get().products.find((p) => p.id === id) ||
				(await getMockProduct(id)); // Fallback to API call
			set({ currentProduct: product, isLoading: false });
		} catch (error) {
			set({
				error: "Failed to fetch product",
				isLoading: false,
			});
		}
	},

	// Add method to force refresh products
	refreshProducts: async () => {
		return get().fetchProducts(true);
	},
}));

// Helper function to generate mock products
const generateMockProducts = () => {
	const vinylRecords = [
		{
			title: "Dark Side of the Moon",
			artist: "Pink Floyd",
			price: 29.99,
			genre: "Rock",
			year: 1973,
		},
		{
			title: "Thriller",
			artist: "Michael Jackson",
			price: 27.99,
			genre: "Pop",
			year: 1982,
		},
		{
			title: "Back in Black",
			artist: "AC/DC",
			price: 24.99,
			genre: "Rock",
			year: 1980,
		},
		{
			title: "Rumours",
			artist: "Fleetwood Mac",
			price: 29.99,
			genre: "Rock",
			year: 1977,
		},
		{
			title: "Abbey Road",
			artist: "The Beatles",
			price: 32.99,
			genre: "Rock",
			year: 1969,
		},
		{
			title: "Kind of Blue",
			artist: "Miles Davis",
			price: 34.99,
			genre: "Jazz",
			year: 1959,
		},
		{
			title: "Purple Rain",
			artist: "Prince",
			price: 28.99,
			genre: "Pop",
			year: 1984,
		},
		{
			title: "Blue Train",
			artist: "John Coltrane",
			price: 31.99,
			genre: "Jazz",
			year: 1957,
		},
		{
			title: "Nevermind",
			artist: "Nirvana",
			price: 26.99,
			genre: "Rock",
			year: 1991,
		},
		{
			title: "Legend",
			artist: "Bob Marley",
			price: 25.99,
			genre: "Reggae",
			year: 1984,
		},
		{
			title: "Random Access Memories",
			artist: "Daft Punk",
			price: 35.99,
			genre: "Electronic",
			year: 2013,
		},
		{
			title: "The Chronic",
			artist: "Dr. Dre",
			price: 27.99,
			genre: "Hip Hop",
			year: 1992,
		},
		{
			title: "Blue Lines",
			artist: "Massive Attack",
			price: 29.99,
			genre: "Electronic",
			year: 1991,
		},
		{
			title: "The Rise and Fall of Ziggy Stardust",
			artist: "David Bowie",
			price: 28.99,
			genre: "Rock",
			year: 1972,
		},
		{
			title: "Ready to Die",
			artist: "The Notorious B.I.G.",
			price: 29.99,
			genre: "Hip Hop",
			year: 1994,
		},
		// ... add more vinyl records
	].map((record, index) => ({
		id: `vinyl-${index + 1}`,
		...record,
		category: CATEGORIES.VINYL,
		imageUrl: "/images/placeholder.jpg",
		condition: ["New", "Mint", "Very Good"][Math.floor(Math.random() * 3)],
		inStock: true,
		createdAt: new Date(Date.now() - index * 86400000).toISOString(), // Stagger dates
	}));

	const turntables = [
		{ title: "Pro-Ject Debut Carbon EVO", price: 599.99 },
		{ title: "Audio-Technica AT-LP120XUSB", price: 299.99 },
		{ title: "Rega Planar 1", price: 475.0 },
		{ title: "Fluance RT85", price: 499.99 },
		{ title: "U-Turn Audio Orbit Plus", price: 309.0 },
		{ title: "Sony PS-LX310BT", price: 199.99 },
		{ title: "Pro-Ject T1", price: 329.0 },
		{ title: "Denon DP-300F", price: 329.99 },
		{ title: "Pioneer PLX-1000", price: 699.99 },
		{ title: "Technics SL-1200MK7", price: 999.99 },
	].map((turntable, index) => ({
		id: `turntable-${index + 1}`,
		...turntable,
		category: CATEGORIES.TURNTABLES,
		imageUrl: "/images/placeholder.jpg",
		condition: "New",
		inStock: true,
		createdAt: new Date(Date.now() - index * 86400000).toISOString(),
	}));

	const accessories = [
		{ title: "Vinyl Cleaning Kit", price: 24.99 },
		{ title: "Anti-Static Brush", price: 14.99 },
		{ title: "Record Weight", price: 39.99 },
		{ title: "Stylus Cleaner", price: 19.99 },
		{ title: "Record Inner Sleeves (50pk)", price: 19.99 },
		{ title: "Record Outer Sleeves (50pk)", price: 24.99 },
		{ title: "Cartridge Alignment Protractor", price: 29.99 },
		{ title: "Vinyl Storage Box", price: 34.99 },
		{ title: "Record Display Stand", price: 15.99 },
		{ title: "Turntable Belt", price: 12.99 },
		{ title: "Phono Preamp", price: 89.99 },
		{ title: "RCA Cables", price: 19.99 },
		{ title: "Record Level", price: 24.99 },
		{ title: "Dust Cover", price: 29.99 },
		{ title: "Cleaning Solution", price: 14.99 },
	].map((accessory, index) => ({
		id: `accessory-${index + 1}`,
		...accessory,
		category: CATEGORIES.ACCESSORIES,
		imageUrl: "/images/placeholder.jpg",
		condition: "New",
		inStock: true,
		createdAt: new Date(Date.now() - index * 86400000).toISOString(),
	}));

	const merch = [
		{ title: "Pink Floyd T-Shirt", artist: "Pink Floyd", price: 24.99 },
		{ title: "Led Zeppelin Poster", artist: "Led Zeppelin", price: 19.99 },
		{ title: "Beatles Coffee Mug", artist: "The Beatles", price: 14.99 },
		{ title: "Rolling Stones Hat", artist: "Rolling Stones", price: 22.99 },
		{ title: "Queen Hoodie", artist: "Queen", price: 44.99 },
		{ title: "Nirvana Backpack", artist: "Nirvana", price: 39.99 },
		{ title: "Metallica Phone Case", artist: "Metallica", price: 19.99 },
		{ title: "AC/DC Wall Flag", artist: "AC/DC", price: 29.99 },
		{ title: "David Bowie Tote Bag", artist: "David Bowie", price: 18.99 },
		{ title: "The Doors Keychain", artist: "The Doors", price: 9.99 },
	].map((item, index) => ({
		id: `merch-${index + 1}`,
		...item,
		category: CATEGORIES.MERCH,
		imageUrl: "/images/placeholder.jpg",
		condition: "New",
		inStock: true,
		createdAt: new Date(Date.now() - index * 86400000).toISOString(),
	}));

	const allProducts = [
		...vinylRecords,
		...turntables,
		...accessories,
		...merch,
	];
	console.log("Generated products:", allProducts.length);
	return allProducts;
};

// Update getMockProducts to use the generator
const getMockProducts = () =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(generateMockProducts());
		}, 500);
	});

// Mock single product fetch
const getMockProduct = (id) =>
	new Promise((resolve, reject) => {
		setTimeout(() => {
			getMockProducts().then((products) => {
				const product = products.find((p) => p.id === id);
				if (product) {
					resolve(product);
				} else {
					reject(new Error("Product not found"));
				}
			});
		}, 500);
	});
