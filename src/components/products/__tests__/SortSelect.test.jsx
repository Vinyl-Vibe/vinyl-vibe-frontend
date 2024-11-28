import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SORT_OPTIONS, useProductStore } from '../../../store/products'
import SortSelect from '../SortSelect'

describe('SortSelect', () => {
  it('should render sort options', () => {
    render(<SortSelect />)
    
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('Price: Low to High')).toBeInTheDocument()
    expect(screen.getByText('Price: High to Low')).toBeInTheDocument()
    // ... check other options
  })

  it('should call setSortBy when option selected', () => {
    const setSortBy = vi.fn()
    useProductStore.setState({ setSortBy })
    render(<SortSelect />)
    
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Price: Low to High'))
    expect(setSortBy).toHaveBeenCalledWith(SORT_OPTIONS.PRICE_LOW)
  })
}) 