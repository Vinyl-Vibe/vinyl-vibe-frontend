import { Link, Routes, Route } from 'react-router-dom'

/* 
  DashboardPage: Admin dashboard layout and routing
  - Provides navigation for admin features
  - Handles nested admin routes
  - Protected by AdminRoute component
*/
function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Link to="/" className="text-sm">
              Back to Store
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Products</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Customers</h3>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-x-4">
          <Link 
            to="/admin/orders"
            className="text-sm font-medium hover:text-primary"
          >
            Orders
          </Link>
          <Link 
            to="/admin/products"
            className="text-sm font-medium hover:text-primary"
          >
            Products
          </Link>
          <Link 
            to="/admin/customers"
            className="text-sm font-medium hover:text-primary"
          >
            Customers
          </Link>
        </nav>

        {/* Nested Routes */}
        <div className="mt-8">
          <Routes>
            <Route index element={<div>Welcome to the dashboard</div>} />
            <Route path="orders" element={<div>Orders list will go here</div>} />
            <Route path="products" element={<div>Products list will go here</div>} />
            <Route path="customers" element={<div>Customers list will go here</div>} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage 