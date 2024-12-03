import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import CheckoutPage from '../CheckoutPage'

// Mock MainNav component
vi.mock('../../../components/layout/MainNav', () => ({
  default: () => <div data-testid="main-nav">Main Nav</div>
}))

// Mock fetch for Stripe checkout
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock window.location
const mockLocation = {
  href: ''
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: { id: 'test-user-id' }
    })
  })

  it('should render checkout page with order summary', () => {
    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('main-nav')).toBeInTheDocument()
    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText('Order Summary')).toBeInTheDocument()
    expect(screen.getByText('Proceed to Payment')).toBeInTheDocument()
  })

  it('should handle successful checkout redirect', async () => {
    const checkoutUrl = 'https://checkout.stripe.com/test-session'
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ url: checkoutUrl })
    })

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Proceed to Payment'))

    // Button should show loading state
    expect(screen.getByText('Redirecting...')).toBeInTheDocument()

    await waitFor(() => {
      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user-id',
          items: []
        })
      })

      // Verify redirect
      expect(mockLocation.href).toBe(checkoutUrl)
    })
  })

  it('should handle checkout error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Checkout failed'))

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Proceed to Payment'))

    await waitFor(() => {
      expect(screen.getByText('Failed to initiate checkout. Please try again.')).toBeInTheDocument()
      expect(screen.getByText('Proceed to Payment')).not.toBeDisabled()
    })
  })
}) 