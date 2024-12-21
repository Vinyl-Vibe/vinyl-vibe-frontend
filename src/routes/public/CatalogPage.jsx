import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MainNav from "../../components/navigation/store/StoreNav";
import ProductCard from "../../components/products/ProductCard";
import CategoryFilter from "../../components/products/CategoryFilter";
import SortSelect from "../../components/products/SortSelect";
import ProductCardSkeleton from "../../components/products/ProductCardSkeleton";
import { useProductStore, CATEGORIES } from "../../store/products";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/ui/pagination";
import { useMinimumLoadingTime } from "../../hooks/useMinimumLoadingTime";

/* 
    CatalogPage: Product listing page
    - Displays grid of ProductCards
    - Handles loading and error states
    - Will add filtering/sorting later
*/
function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        isLoading,
        error,
        fetchProducts,
        products,
        page,
        setPage,
        totalPages,
        totalProducts,
        activeCategory,
        setCategory,
        resetFilters,
    } = useProductStore();
    const location = useLocation();

    const showLoader = useMinimumLoadingTime(isLoading);

    // Handle page change
    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        if (newPage > 1) {
            newParams.set("page", newPage.toString());
        } else {
            newParams.delete("page");
        }
        setSearchParams(newParams);
    };

    // Fetch products when URL params change
    useEffect(() => {
        const type = searchParams.get("type");
        const sort = searchParams.get("sort");
        const currentPage = searchParams.get("page");

        console.log("Fetching products with params:", {
            type,
            sort,
            page: currentPage,
        });

        fetchProducts({
            type,
            sort,
            page: currentPage ? Number(currentPage) : 1,
        });
    }, [searchParams, fetchProducts]);

    // Reset filters when unmounting catalog page
    useEffect(() => {
        return () => resetFilters();
    }, [resetFilters]);

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

                <div className="mt-[-1px] transition-all duration-500">
                    <div className="grid grid-cols-1 gap-[1px] border sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                        {showLoader ? (
                            <>
                                <ProductCardSkeleton count={12} />
                            </>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="ring-1 ring-border ring-offset-0 duration-500 animate-in fade-in"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center gap-4 border-[0.5px] p-6">
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
                                <div className="space-y-2 text-center">
                                    <h3 className="text-xl font-semibold">
                                        No products found
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {activeCategory
                                            ? `No products found in the ${activeCategory} category.`
                                            : "No products found. Please try a different search or check back later."}
                                    </p>
                                </div>
                                {error && (
                                    <Alert
                                        variant="destructive"
                                        className="mt-4 max-w-sm rounded-xl bg-red-500/10 [&>svg]:top-3"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>
                                            Error loading products
                                        </AlertTitle>
                                        <AlertDescription className="mt-2">
                                            <div className="space-y-2">
                                                <p>{error.message || error}</p>
                                                {error.response?.data
                                                    ?.message && (
                                                    <p className="text-sm text-red-300">
                                                        Server message:{" "}
                                                        {
                                                            error.response.data
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                                {error.response?.status && (
                                                    <p className="text-sm text-red-300">
                                                        Status code:{" "}
                                                        {error.response.status}
                                                    </p>
                                                )}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Only show pagination when we have data and more than one page */}
                    {!isLoading && totalPages > 1 && (
                        <Pagination
                            currentPage={Number(searchParams.get("page")) || 1}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </main>
        </>
    );
}

export default CatalogPage;
