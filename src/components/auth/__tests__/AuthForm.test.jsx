import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import AuthForm from '../AuthForm'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: { pathname: '/checkout' } } })
  }
})

describe('AuthForm', () => {
  const mockLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      login: mockLogin,
      error: null
    })
  })

  it('should render login form by default', () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    )

    expect(screen.getByText('Welcome to Vinyl Vibe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('should handle login submission', async () => {
    mockLogin.mockResolvedValueOnce({})

    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    })
    expect(mockNavigate).toHaveBeenCalledWith('/checkout', { replace: true })
  })
}) 