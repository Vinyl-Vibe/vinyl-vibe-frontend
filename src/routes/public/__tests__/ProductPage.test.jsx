import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useProductStore } from '../../../store/products'
import ProductPage from '../ProductPage'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => (...args) => mockNavigate(...args),
    useParams: () => ({ id: '1' })
  }
})

describe('ProductPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductStore.setState({
      currentProduct: {
        id: '1',
        title: 'Test Product',
        price: 29.99,
        imageUrl: '/test.jpg'
      },
      scrollPosition: 100
    })
  })

  it('should navigate back when back button is clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ProductPage />
      </MemoryRouter>
    )

    fireEvent.click(getByText('Back to Catalog'))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
}) 