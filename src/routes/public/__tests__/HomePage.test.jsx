import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../HomePage'

// Mock MainNav component
vi.mock('../../../components/layout/MainNav', () => ({
  default: () => <div data-testid="main-nav">Main Nav</div>
}))

describe('HomePage', () => {
  it('should render welcome message and navigation', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('main-nav')).toBeInTheDocument()
    expect(screen.getByText('Welcome to Vinyl Vibe')).toBeInTheDocument()
    expect(screen.getByText('Discover your next favorite record.')).toBeInTheDocument()
  })
}) 