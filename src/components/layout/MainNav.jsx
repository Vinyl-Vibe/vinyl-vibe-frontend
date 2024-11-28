import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

function MainNav() {
  const { isAuthenticated, isAdmin } = useAuthStore()

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">Vinyl Vibe</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium">
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/account" className="text-sm font-medium">
                  Account
                </Link>
                <button className="text-sm font-medium">
                  Cart (0)
                </button>
              </>
            ) : (
              <Link to="/auth" className="text-sm font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MainNav 