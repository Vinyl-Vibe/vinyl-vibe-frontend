import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './components/auth/AuthProvider'
import AuthRoute from './components/auth/AuthRoute'
import AdminRoute from './components/auth/AdminRoute'

// Public routes
import HomePage from './routes/public/HomePage'
import AuthPage from './routes/public/AuthPage'

// Protected routes
import CheckoutPage from './routes/protected/CheckoutPage'

// Admin routes
import DashboardPage from './routes/admin/DashboardPage'

// Error pages
import ForbiddenPage from './routes/error/ForbiddenPage'
import NotFoundPage from './routes/error/NotFoundPage'

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<div className="min-h-screen bg-background">
					<Routes>
						{/* Public routes */}
						<Route path="/" element={<HomePage />} />
						<Route path="/auth" element={<AuthPage />} />
						
						{/* Protected routes */}
						<Route 
							path="/checkout" 
							element={
								<AuthRoute>
									<CheckoutPage />
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
		</BrowserRouter>
	);
}

export default App;
