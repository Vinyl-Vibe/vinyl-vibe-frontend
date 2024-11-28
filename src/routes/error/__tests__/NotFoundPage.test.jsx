import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFoundPage from '../NotFoundPage'

describe('NotFoundPage', () => {
  it('should render not found message', () => {
    render(<NotFoundPage />)
    
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument()
    expect(
      screen.getByText("The page you're looking for doesn't exist.")
    ).toBeInTheDocument()
  })
}) 