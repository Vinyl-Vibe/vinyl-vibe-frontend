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
        activeCategory,
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

                {error && (
                    <Alert variant="destructive" className="mt-6">
                        {error}
                    </Alert>
                )}

                <div className="mt-[-1px] transition-all duration-500">
                    <div className="grid grid-cols-1 gap-[1px] border sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            <div className="ring-1 ring-offset-0 ring-border duration-500 animate-in fade-in">
                                <ProductCardSkeleton count={12} />
                            </div>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="ring-1 ring-offset-0 ring-border duration-500 animate-in fade-in"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center gap-4 border-[0.5px] p-6 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" x2="12" y1="8" y2="12" />
                                        <line
                                            x1="12"
                                            x2="12.01"
                                            y1="16"
                                            y2="16"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">
                                        No products found
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {activeCategory
                                            ? `No products found in the ${activeCategory} category.`
                                            : "No products found. Please try a different search or check back later."}
                                    </p>
                                </div>
                            </div>
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
