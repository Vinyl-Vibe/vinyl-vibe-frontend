import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import App from './App'

// Mock all route components
vi.mock('./routes/public/HomePage', () => ({
  default: () => <div>Home Page</div>
}))

vi.mock('./routes/public/AuthPage', () => ({
  default: () => <div>Auth Page</div>
}))

vi.mock('./routes/protected/CheckoutPage', () => ({
  default: () => <div>Checkout Page</div>
}))

vi.mock('./routes/admin/DashboardPage', () => ({
  default: () => <div>Admin Dashboard</div>
}))

vi.mock('./routes/error/ForbiddenPage', () => ({
  default: () => <div>403 Page</div>
}))

vi.mock('./routes/error/NotFoundPage', () => ({
  default: () => <div>404 Page</div>
}))

describe('App', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isAdmin: false
    })
  })

  it('should render home page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('should render auth page for unauthenticated users trying to access protected routes', () => {
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Auth Page')).toBeInTheDocument()
  })

  it('should render checkout page for authenticated users', () => {
    useAuthStore.setState({ isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Checkout Page')).toBeInTheDocument()
  })

  it('should render admin dashboard for admin users', () => {
    useAuthStore.setState({ 
      isAuthenticated: true,
      isAdmin: true 
    })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
  })

  it('should render forbidden page for non-admin users trying to access admin routes', () => {
    useAuthStore.setState({ 
      isAuthenticated: true,
      isAdmin: false 
    })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('403 Page')).toBeInTheDocument()
  })

  it('should render not found page for invalid routes', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('404 Page')).toBeInTheDocument()
  })
}) 