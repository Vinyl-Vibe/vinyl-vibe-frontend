import { Routes, Route } from 'react-router-dom'
import AuthProvider from './components/auth/AuthProvider'
import AuthRoute from './components/auth/AuthRoute'
import AdminRoute from './components/auth/AdminRoute'

// Public routes
import HomePage from './routes/public/HomePage'
import AuthPage from './routes/public/AuthPage'
import CatalogPage from './routes/public/CatalogPage'
import ProductPage from './routes/public/ProductPage'

// Protected routes
import CheckoutPage from './routes/protected/CheckoutPage'

// Admin routes
import DashboardPage from './routes/admin/DashboardPage'

// Error pages
import ForbiddenPage from './routes/error/ForbiddenPage'
import NotFoundPage from './routes/error/NotFoundPage'
import MainNav from './components/layout/MainNav'

function App() {
	return (
		<AuthProvider>
			<div className="w-dvw min-h-screen bg-background">
				<Routes>
					{/* Public routes - wrapped in MainNav */}
					<Route path="/" element={<MainNav><HomePage /></MainNav>} />
					<Route path="/auth" element={<MainNav><AuthPage /></MainNav>} />
					<Route path="/catalog" element={<MainNav><CatalogPage /></MainNav>} />
					<Route path="/products/:id" element={<MainNav><ProductPage /></MainNav>} />

					{/* Protected routes */}
					<Route
						path="/checkout" 
						element={
							<AuthRoute>
								<MainNav><CheckoutPage /></MainNav>
							</AuthRoute>
						} 
					/>
					
					{/* Admin routes */}
					<Route 
						path="/admin/*" 
						element={
							<AdminRoute>
								<DashboardPage />
							</AdminRoute>
						} 
					/>

					{/* Error pages */}
					<Route path="/403" element={<ForbiddenPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</div>
		</AuthProvider>
	);
}

export default App;
