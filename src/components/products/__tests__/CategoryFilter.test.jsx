import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CATEGORIES, useProductStore } from '../../../store/products'
import CategoryFilter from '../CategoryFilter'

describe('CategoryFilter', () => {
  it('should render all category buttons', () => {
    render(<CategoryFilter />)
    
    Object.keys(CATEGORIES).forEach(category => {
      expect(screen.getByText(category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' '))).toBeInTheDocument()
    })
  })

  it('should highlight active category', () => {
    useProductStore.setState({ activeCategory: CATEGORIES.VINYL })
    render(<CategoryFilter />)
    
    const vinylButton = screen.getByText('Vinyl')
    expect(vinylButton).toHaveClass('bg-primary')
  })

  it('should call setCategory when clicked', () => {
    const setCategory = vi.fn()
    useProductStore.setState({ setCategory })
    render(<CategoryFilter />)
    
    fireEvent.click(screen.getByText('Vinyl'))
    expect(setCategory).toHaveBeenCalledWith(CATEGORIES.VINYL)
  })
}) 