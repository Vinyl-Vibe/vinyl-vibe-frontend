import { create } from 'zustand'

export const CATEGORIES = {
  ALL: 'all',
  VINYL: 'vinyl',
  TURNTABLES: 'turntables',
  ACCESSORIES: 'accessories',
  MERCH: 'merch'
}

export const SORT_OPTIONS = {
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  NEWEST: 'newest',
  TITLE_AZ: 'title-az',
  TITLE_ZA: 'title-za'
}

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  activeCategory: CATEGORIES.ALL,
  sortBy: SORT_OPTIONS.NEWEST,
  scrollPosition: 0,
  hasLoaded: false,

  setCategory: (category) => {
    set({ activeCategory: category })
  },

  setSortBy: (sortOption) => {
    set({ sortBy: sortOption })
  },

  saveScrollPosition: (position) => {
    set({ scrollPosition: position })
  },

  // Get filtered and sorted products
  getFilteredProducts: () => {
    const { products, activeCategory, sortBy } = get()
    
    // First filter by category
    const filtered = activeCategory === CATEGORIES.ALL
      ? products
      : products.filter(product => product.category === activeCategory)

    // Then sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.PRICE_LOW:
          return a.price - b.price
        case SORT_OPTIONS.PRICE_HIGH:
          return b.price - a.price
        case SORT_OPTIONS.NEWEST:
          return new Date(b.createdAt) - new Date(a.createdAt)
        case SORT_OPTIONS.TITLE_AZ:
          return a.title.localeCompare(b.title)
        case SORT_OPTIONS.TITLE_ZA:
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
  },

  // Fetch products (currently mock data)
  fetchProducts: async (forceRefresh = false) => {
    if (get().hasLoaded && !forceRefresh) {
      return
    }

    set({ isLoading: true, error: null })
    try {
      const products = await getMockProducts()
      set({ products, isLoading: false, hasLoaded: true })
    } catch (error) {
      set({ 
        error: 'Failed to fetch products',
        isLoading: false 
      })
    }
  },

  // Get single product (currently mock data)
  getProduct: (id) => {
    const { products } = useProductStore.getState()
    return products.find(product => product.id === id)
  },

  // Fetch single product
  fetchProduct: async (id) => {
    set({ isLoading: true, error: null, currentProduct: null })
    try {
      // In development, get from cached products
      const product = get().products.find(p => p.id === id) || 
        await getMockProduct(id) // Fallback to API call
      set({ currentProduct: product, isLoading: false })
    } catch (error) {
      set({ 
        error: 'Failed to fetch product',
        isLoading: false 
      })
    }
  },

  // Add method to force refresh products
  refreshProducts: async () => {
    return get().fetchProducts(true)
  }
}))

// Updated mock data with categories and createdAt dates
const getMockProducts = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve([
      {
        id: '1',
        title: 'Dark Side of the Moon',
        artist: 'Pink Floyd',
        price: 29.99,
        imageUrl: '/images/placeholder.jpg',
        category: CATEGORIES.VINYL,
        createdAt: '2024-03-15T10:00:00Z',
        genre: 'Rock',
        year: 1973,
        condition: 'New',
        inStock: true
      },
      {
        id: '2',
        title: 'Pro-Ject Debut Carbon EVO',
        artist: null,
        price: 599.99,
        imageUrl: '/images/placeholder.jpg',
        category: CATEGORIES.TURNTABLES,
        createdAt: '2024-03-14T10:00:00Z',
        condition: 'New',
        inStock: true
      },
      {
        id: '3',
        title: 'Vinyl Cleaning Kit',
        artist: null,
        price: 24.99,
        imageUrl: '/images/placeholder.jpg',
        category: CATEGORIES.ACCESSORIES,
        createdAt: '2024-03-13T10:00:00Z',
        condition: 'New',
        inStock: true
      },
      {
        id: '4',
        title: 'Band T-Shirt',
        artist: 'Various',
        price: 19.99,
        imageUrl: '/images/placeholder.jpg',
        category: CATEGORIES.MERCH,
        createdAt: '2024-03-12T10:00:00Z',
        condition: 'New',
        inStock: true
      }
    ])
  }, 500)
})

// Mock single product fetch
const getMockProduct = (id) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const product = getMockProducts().then(products => 
      products.find(p => p.id === id)
    )
    if (product) {
      resolve(product)
    } else {
      reject(new Error('Product not found'))
    }
  }, 500)
}) 