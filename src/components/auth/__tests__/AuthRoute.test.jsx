import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import AuthRoute from '../AuthRoute'

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div>Redirected to {to}</div>)
  }
})

describe('AuthRoute', () => {
  const TestComponent = () => <div>Protected Content</div>

  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false
    })
  })

  it('should redirect to auth when not authenticated', () => {
    render(
      <MemoryRouter>
        <AuthRoute>
          <TestComponent />
        </AuthRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Redirected to /auth')).toBeInTheDocument()
  })

  it('should render children when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true })

    render(
      <MemoryRouter>
        <AuthRoute>
          <TestComponent />
        </AuthRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
}) 