import { describe, it, expect, beforeEach } from 'vitest'
import { useProductStore, CATEGORIES, SORT_OPTIONS } from '../products'

describe('useProductStore', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [],
      isLoading: false,
      error: null,
      activeCategory: CATEGORIES.ALL,
      sortBy: SORT_OPTIONS.NEWEST,
      page: 1,
      hasLoaded: false
    })
  })

  it('should set category and reset page', () => {
    const { setCategory } = useProductStore.getState()
    setCategory(CATEGORIES.VINYL)
    
    const state = useProductStore.getState()
    expect(state.activeCategory).toBe(CATEGORIES.VINYL)
    expect(state.page).toBe(1)
  })

  it('should set sort option and reset page', () => {
    const { setSortBy } = useProductStore.getState()
    setSortBy(SORT_OPTIONS.PRICE_LOW)
    
    const state = useProductStore.getState()
    expect(state.sortBy).toBe(SORT_OPTIONS.PRICE_LOW)
    expect(state.page).toBe(1)
  })

  it('should reset filters to default state', () => {
    const { setCategory, setSortBy, setPage, resetFilters } = useProductStore.getState()
    
    // Change some values
    setCategory(CATEGORIES.VINYL)
    setSortBy(SORT_OPTIONS.PRICE_HIGH)
    setPage(3)
    
    // Reset
    resetFilters()
    
    const state = useProductStore.getState()
    expect(state.activeCategory).toBe(CATEGORIES.ALL)
    expect(state.sortBy).toBe(SORT_OPTIONS.NEWEST)
    expect(state.page).toBe(1)
    expect(state.scrollPosition).toBe(0)
  })

  it('should filter products by category', () => {
    const mockProducts = [
      { id: '1', category: CATEGORIES.VINYL },
      { id: '2', category: CATEGORIES.TURNTABLES },
      { id: '3', category: CATEGORIES.VINYL }
    ]
    
    useProductStore.setState({ products: mockProducts })
    const { setCategory, getFilteredProducts } = useProductStore.getState()
    
    setCategory(CATEGORIES.VINYL)
    const { items, totalItems } = getFilteredProducts()
    
    expect(items.length).toBe(2)
    expect(totalItems).toBe(2)
  })

  it('should paginate products correctly', () => {
    const mockProducts = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      category: CATEGORIES.VINYL
    }))
    
    useProductStore.setState({ 
      products: mockProducts,
      pageSize: 6
    })
    
    const { setPage, getFilteredProducts } = useProductStore.getState()
    setPage(2)
    
    const { items, totalPages } = getFilteredProducts()
    expect(items.length).toBe(6)
    expect(totalPages).toBe(3)
  })
}) 