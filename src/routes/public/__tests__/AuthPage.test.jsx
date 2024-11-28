import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AuthPage from '../AuthPage'

// Mock the AuthForm component since it's tested separately
vi.mock('../../../components/auth/AuthForm', () => ({
  default: () => <div data-testid="auth-form">Auth Form</div>
}))

describe('AuthPage', () => {
  it('should render AuthForm', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    )
    
    expect(getByTestId('auth-form')).toBeInTheDocument()
  })
}) 