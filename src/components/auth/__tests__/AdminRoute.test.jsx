import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import AdminRoute from '../AdminRoute'

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div>Redirected to {to}</div>)
  }
})

describe('AdminRoute', () => {
  const TestComponent = () => <div>Protected Content</div>

  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isAdmin: false
    })
  })

  it('should redirect to auth when not authenticated', () => {
    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Redirected to /auth')).toBeInTheDocument()
  })

  it('should redirect to forbidden when authenticated but not admin', () => {
    useAuthStore.setState({ 
      isAuthenticated: true,
      isAdmin: false 
    })

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Redirected to /403')).toBeInTheDocument()
  })

  it('should render children when authenticated and admin', () => {
    useAuthStore.setState({ 
      isAuthenticated: true,
      isAdmin: true 
    })

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
}) 