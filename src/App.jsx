import { Routes, Route } from "react-router-dom";
import AuthProvider from "./components/auth/AuthProvider";
import AuthRoute from "./components/auth/AuthRoute";
import AdminRoute from "./components/auth/AdminRoute";
import UserProvider from "./components/user/UserProvider";
import { ThemeProvider } from "./components/theme/theme-provider";

// Public routes
import HomePage from "./routes/public/HomePage";
import AuthPage from "./routes/public/AuthPage";
import CatalogPage from "./routes/public/CatalogPage";
import ProductPage from "./routes/public/ProductPage";
import SearchResultsPage from "./routes/public/SearchResultsPage";

// Protected routes
import CheckoutPage from "./routes/protected/CheckoutPage";

// Admin routes
import DashboardPage from "./routes/admin/DashboardPage";

// Error pages
import ForbiddenPage from "./routes/error/ForbiddenPage";
import NotFoundPage from "./routes/error/NotFoundPage";

import AuthCallback from "./components/auth/AuthCallback";
import { setupAxiosInterceptors } from "./lib/axios";
import { tokenStorage } from "./lib/token";

// Initialize axios interceptors with tokenStorage
setupAxiosInterceptors(tokenStorage);

function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <div className="flex h-screen w-dvw flex-col bg-background px-0 sm:px-10">
                    <Routes>
                        {/* Public routes - wrapped in MainNav */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/reset-password" element={<AuthPage />} />
                        
                        {/* Product routes */}
                        <Route path="/products" element={<CatalogPage />} />
                        <Route path="/products/:category" element={<CatalogPage />} />
                        <Route path="/products/item/:id" element={<ProductPage />} />
                        
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

                        {/* Add auth callback route */}
                        <Route
                            path="/auth/callback"
                            element={<AuthCallback />}
                        />

                        <Route path="/search" element={<SearchResultsPage />} />
                    </Routes>
                </div>
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
