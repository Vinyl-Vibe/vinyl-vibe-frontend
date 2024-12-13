import { useEffect } from "react";
import MainNav from "../../components/layout/MainNav";
import ProductCard from "../../components/products/ProductCard";
import CategoryFilter from "../../components/products/CategoryFilter";
import SortSelect from "../../components/products/SortSelect";
import ProductCardSkeleton from "../../components/products/ProductCardSkeleton";
import { useProductStore, CATEGORIES } from "../../store/products";
import { Alert } from "../../components/ui/alert";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/ui/pagination";

/* 
    CatalogPage: Product listing page
    - Displays grid of ProductCards
    - Handles loading and error states
    - Will add filtering/sorting later
*/
function CatalogPage() {
    const {
        isLoading,
        error,
        fetchProducts,
        products,
        hasLoaded,
        page,
        setPage,
        totalPages,
        totalProducts,
        activeCategory
    } = useProductStore();
    const location = useLocation();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <>
            <MainNav />
            <main className="mx-auto w-full max-w-7xl pb-6 pt-[calc(5rem-1px)]">
                <div className="border px-6 pb-6 pt-40">
                    <h1 className="text-5xl font-medium tracking-tight">
                        Products
                    </h1>
                </div>

                {/* Filters and Sort */}
                <div className="mt-[-1px] flex flex-col justify-between gap-4 border p-6 sm:flex-row">
                    <CategoryFilter />
                    <SortSelect />
                </div>

                {/* Product count */}
                {!isLoading && (
                    <p className="mt-4 text-sm text-gray-500">
                        Showing {products.length} of {totalProducts} products
                    </p>
                )}

                {error && (
                    <Alert variant="destructive" className="mt-6">
                        {error}
                    </Alert>
                )}

                <div className="mt-[-1px] transition-all duration-500">
                    <div className="grid grid-cols-1 border-[0.5px] sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            <ProductCardSkeleton count={12} />
                        ) : (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="duration-500 animate-in fade-in"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>

                    {/* Only show pagination when we have data and more than one page */}
                    {!isLoading && totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </main>
        </>
    );
}

export default CatalogPage;
