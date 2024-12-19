import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./components/auth/AuthProvider";
import AuthRoute from "./components/auth/AuthRoute";
import AdminRoute from "./components/auth/AdminRoute";
import UserProvider from "./components/user/UserProvider";

// Public routes
import HomePage from "./routes/public/HomePage";
import AuthPage from "./routes/public/AuthPage";
import CatalogPage from "./routes/public/CatalogPage";
import ProductPage from "./routes/public/ProductPage";
import SearchResultsPage from "./routes/public/SearchResultsPage";

// Admin routes
import DashboardPage from "./routes/admin/DashboardPage";
import StoreOrdersPage from "./routes/protected/StoreOrdersPage";
import AdminOrdersPage from "./routes/admin/AdminOrdersPage";
import AdminProductsPage from "./routes/admin/AdminProductsPage";
import AdminCustomersPage from "./routes/admin/AdminCustomersPage";

// Error pages
import ForbiddenPage from "./routes/error/ForbiddenPage";
import NotFoundPage from "./routes/error/NotFoundPage";

import AuthCallback from "./components/auth/AuthCallback";
import { setupAxiosInterceptors } from "./lib/axios";
import { tokenStorage } from "./lib/token";
import OrderSuccessPage from "./routes/protected/OrderSuccessPage";

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

                        {/* Product routes - order matters! */}
                        <Route
                            path="/products/item/:id"
                            element={<ProductPage />}
                        />
                        <Route
                            path="/products/:category"
                            element={<CatalogPage />}
                        />
                        <Route path="/products" element={<CatalogPage />} />

                        {/* Admin routes */}
                        <Route path="/admin" element={<AdminRoute />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="orders" element={<AdminOrdersPage />} />
                            <Route path="products" element={<AdminProductsPage />} />
                            <Route path="customers" element={<AdminCustomersPage />} />
                        </Route>

                        {/* Error pages */}
                        <Route path="/403" element={<ForbiddenPage />} />
                        <Route path="*" element={<NotFoundPage />} />

                        {/* Add auth callback route */}
                        <Route
                            path="/auth/callback"
                            element={<AuthCallback />}
                        />

                        <Route path="/search" element={<SearchResultsPage />} />

                        {/* Add new routes for Stripe */}
                        <Route
                            path="/order/success"
                            element={
                                <AuthRoute>
                                    <OrderSuccessPage />
                                </AuthRoute>
                            }
                        />

                        {/* Cancel just redirects to home with error param */}
                        <Route
                            path="/order/cancel"
                            element={<Navigate to="/?stripe=cancel" replace />}
                        />

                        {/* Protected routes */}
                        <Route
                            path="/orders"
                            element={
                                <AuthRoute>
                                    <StoreOrdersPage />
                                </AuthRoute>
                            }
                        />
                    </Routes>
                </div>
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
