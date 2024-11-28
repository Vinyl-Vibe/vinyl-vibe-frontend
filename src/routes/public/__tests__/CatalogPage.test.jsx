import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useProductStore } from '../../../store/products'
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
      fetchProducts: vi.fn()
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
}) 