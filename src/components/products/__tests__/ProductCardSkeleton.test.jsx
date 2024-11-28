import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProductCardSkeleton from '../ProductCardSkeleton'

describe('ProductCardSkeleton', () => {
  it('should render skeleton elements with animation', () => {
    const { container } = render(<ProductCardSkeleton />)
    
    // Check for animated elements
    const animatedElements = container.getElementsByClassName('animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)

    // Check for placeholder shapes
    expect(container.querySelector('.aspect-square')).toBeInTheDocument()
    expect(container.querySelectorAll('.h-4').length).toBeGreaterThan(0)
  })
}) 