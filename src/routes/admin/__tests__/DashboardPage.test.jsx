import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '../DashboardPage'

describe('DashboardPage', () => {
  it('should render dashboard layout', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    // Check header content
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Back to Store')).toBeInTheDocument()

    // Check stats cards
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
    expect(screen.getByText('Total Products')).toBeInTheDocument()
    expect(screen.getByText('Total Customers')).toBeInTheDocument()

    // Check navigation links
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Customers')).toBeInTheDocument()

    // Check default content
    expect(screen.getByText('Welcome to the dashboard')).toBeInTheDocument()
  })
}) 