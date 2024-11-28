import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProductDetailsSkeleton from '../ProductDetailsSkeleton'

describe('ProductDetailsSkeleton', () => {
  it('should render all skeleton elements', () => {
    const { container } = render(<ProductDetailsSkeleton />)
    
    // Check for main sections
    expect(container.querySelector('.aspect-square')).toBeInTheDocument()
    expect(container.querySelector('.lg\\:grid-cols-2')).toBeInTheDocument()
    
    // Check for animated elements
    const animatedElements = container.getElementsByClassName('animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('should match product details layout', () => {
    const { container } = render(<ProductDetailsSkeleton />)
    
    // Check for all major sections
    expect(container.querySelector('.border-t')).toBeInTheDocument() // Details section
    expect(container.querySelector('.space-y-4')).toBeInTheDocument() // Details grid
    expect(container.querySelector('.mt-8')).toBeInTheDocument() // Button section
  })
}) 