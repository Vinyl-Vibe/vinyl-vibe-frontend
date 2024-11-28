import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import MainNav from '../MainNav'

describe('MainNav', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isAdmin: false
    })
  })

  it('should render logo and sign in link when not authenticated', () => {
    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    )

    expect(screen.getByText('Vinyl Vibe')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.queryByText('Account')).not.toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('should render account and cart when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true })

    render(
      <MemoryRouter>
        <MainNav />
      </MemoryRouter>
    )

    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Cart (0)')).toBeInTheDocument()
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
  })

  it('should render dashboard link for admin users', () => {
    useAuthStore.setState({ 
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
}) 