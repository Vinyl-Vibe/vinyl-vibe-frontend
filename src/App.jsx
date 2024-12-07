import { Routes, Route } from "react-router-dom";
import AuthProvider from "./components/auth/AuthProvider";
import AuthRoute from "./components/auth/AuthRoute";
import AdminRoute from "./components/auth/AdminRoute";
import UserProvider from "./components/user/UserProvider";

// Public routes
import HomePage from "./routes/public/HomePage";
import AuthPage from "./routes/public/AuthPage";
import CatalogPage from "./routes/public/CatalogPage";
import ProductPage from "./routes/public/ProductPage";

// Protected routes
import CheckoutPage from "./routes/protected/CheckoutPage";

// Admin routes
import DashboardPage from "./routes/admin/DashboardPage";

// Error pages
import ForbiddenPage from "./routes/error/ForbiddenPage";
import NotFoundPage from "./routes/error/NotFoundPage";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<div className="w-dvw min-h-screen px-10 bg-background">
					<Routes>
						{/* Public routes - wrapped in MainNav */}
						<Route path="/" element={<HomePage />} />
						<Route path="/auth" element={<AuthPage />} />
						<Route path="/catalog" element={<CatalogPage />} />
						<Route path="/products/:id" element={<ProductPage />} />

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
			</UserProvider>
		</AuthProvider>
	);
}

export default App;
