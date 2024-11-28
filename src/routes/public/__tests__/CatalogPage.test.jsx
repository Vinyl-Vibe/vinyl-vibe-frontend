import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useProductStore, CATEGORIES } from '../../../store/products'
import CatalogPage from '../CatalogPage'

// Mock MainNav component
vi.mock('../../../components/layout/MainNav', () => ({
  default: () => <div data-testid="main-nav">Main Nav</div>
}))

// Mock skeleton component
vi.mock('../../components/products/ProductCardSkeleton', () => ({
  default: () => <div data-testid="skeleton">Loading Skeleton</div>
}))

describe('CatalogPage', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [],
      isLoading: false,
      error: null,
      hasLoaded: false,
      fetchProducts: vi.fn(),
      refreshProducts: vi.fn()
    })
  })

  it('should render loading state', () => {
    useProductStore.setState({ isLoading: true })

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render products when loaded', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Dark Side of the Moon',
        artist: 'Pink Floyd',
        price: 29.99,
        imageUrl: '/images/placeholder.jpg'
      }
    ]

    useProductStore.setState({ products: mockProducts })

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Dark Side of the Moon')).toBeInTheDocument()
      expect(screen.getByText('Pink Floyd')).toBeInTheDocument()
    })
  })

  it('should render error message', () => {
    useProductStore.setState({ error: 'Failed to fetch products' })

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Failed to fetch products')).toBeInTheDocument()
  })

  it('should render skeletons while loading', () => {
    useProductStore.setState({ isLoading: true })

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    // Should show 8 skeletons
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(8)
  })

  it('should fetch products when not loaded', () => {
    const fetchProducts = vi.fn()
    useProductStore.setState({ fetchProducts, hasLoaded: false })

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    expect(fetchProducts).toHaveBeenCalled()
  })

  it('should not fetch products when already loaded', () => {
    const fetchProducts = vi.fn()
    useProductStore.setState({ 
      fetchProducts, 
      hasLoaded: true,
      products: [{ id: '1', title: 'Test Product' }]
    })

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    expect(fetchProducts).not.toHaveBeenCalled()
  })

  it('should force refresh products on direct navigation', () => {
    const refreshProducts = vi.fn()
    useProductStore.setState({ refreshProducts })
    
    // Mock direct navigation
    vi.mock('react-router-dom', async () => ({
      ...await vi.importActual('react-router-dom'),
      useLocation: () => ({ key: 'default' })
    }))

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    expect(refreshProducts).toHaveBeenCalled()
  })

  it('should handle category changes', async () => {
    const mockProducts = [
      { id: '1', category: CATEGORIES.VINYL },
      { id: '2', category: CATEGORIES.TURNTABLES }
    ]
    
    useProductStore.setState({ 
      products: mockProducts,
      hasLoaded: true
    })
    
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )
    
    // Test category filter updates
    const { setCategory } = useProductStore.getState()
    act(() => {
      setCategory(CATEGORIES.VINYL)
    })
    
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1)
    })
  })

  it('should handle pagination', async () => {
    const mockProducts = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      category: CATEGORIES.VINYL
    }))
    
    useProductStore.setState({ 
      products: mockProducts,
      hasLoaded: true,
      pageSize: 6
    })
    
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )
    
    expect(screen.getAllByTestId('product-card')).toHaveLength(6)
    
    // Test page change
    fireEvent.click(screen.getByText('2'))
    
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(6)
    })
  })
}) 