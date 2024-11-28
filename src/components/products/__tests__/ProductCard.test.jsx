import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    title: 'Dark Side of the Moon',
    artist: 'Pink Floyd',
    price: 29.99,
    imageUrl: '/images/placeholder.jpg'
  }

  it('should render product information', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )

    expect(screen.getByText('Dark Side of the Moon')).toBeInTheDocument()
    expect(screen.getByText('Pink Floyd')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    
    const image = screen.getByAltText('Dark Side of the Moon')
    expect(image).toHaveAttribute('src', '/images/placeholder.jpg')
  })

  it('should link to product detail page', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/1')
  })
}) 