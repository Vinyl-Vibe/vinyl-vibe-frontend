import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ForbiddenPage from '../ForbiddenPage'

describe('ForbiddenPage', () => {
  it('should render forbidden message', () => {
    render(<ForbiddenPage />)
    
    expect(screen.getByText('403 - Forbidden')).toBeInTheDocument()
    expect(
      screen.getByText("You don't have permission to access this page.")
    ).toBeInTheDocument()
  })
}) 