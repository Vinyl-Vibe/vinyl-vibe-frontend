import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import { useProductStore } from '../../../store/products'
import MainNav from '../MainNav'

// Mock stores
vi.mock('../../../store/auth', () => ({
  useAuthStore: vi.fn()
}))

vi.mock('../../../store/products', () => ({
  useProductStore: vi.fn()
}))

describe('MainNav', () => {
  const resetFilters = vi.fn()
  const refreshProducts = vi.fn()

  beforeEach(() => {
    useAuthStore.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false
    })
    useProductStore.mockReturnValue({
      resetFilters,
      refreshProducts
    })
  })

  it('should render logo and basic navigation', () => {
    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    )

    expect(screen.getByText('Vinyl Vibe')).toBeInTheDocument()
    expect(screen.getByText('Catalog')).toBeInTheDocument()
  })

  it('should show auth-specific links when authenticated', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false
    })

    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    )

    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Cart (0)')).toBeInTheDocument()
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
  })

  it('should show admin link when user is admin', () => {
    useAuthStore.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true
    })

    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should reset filters and refresh products when clicking catalog', () => {
    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Catalog'))
    expect(resetFilters).toHaveBeenCalled()
    expect(refreshProducts).toHaveBeenCalled()
  })
}) 