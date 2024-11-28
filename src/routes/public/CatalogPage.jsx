import { useEffect } from "react";
import MainNav from "../../components/layout/MainNav";
import ProductCard from "../../components/products/ProductCard";
import CategoryFilter from "../../components/products/CategoryFilter";
import SortSelect from "../../components/products/SortSelect";
import ProductCardSkeleton from "../../components/products/ProductCardSkeleton";
import { useProductStore } from "../../store/products";
import { Alert } from "../../components/ui/alert";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";

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
		refreshProducts,
		getFilteredProducts,
		scrollPosition,
		saveScrollPosition,
		products,
		hasLoaded,
		page,
		setPage,
	} = useProductStore();
	const location = useLocation();

	useEffect(() => {
		if (location.key === "default") {
			refreshProducts();
		} else {
			fetchProducts();
		}
	}, [fetchProducts, refreshProducts, location]);

	useEffect(() => {
		if (scrollPosition > 0) {
			window.scrollTo(0, scrollPosition);
		}
	}, [scrollPosition]);

	useEffect(() => {
		const handleScroll = () => {
			saveScrollPosition(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [saveScrollPosition]);

	const {
		items: filteredProducts,
		totalItems,
		totalPages,
	} = getFilteredProducts();

	console.log({
		isLoading,
		hasLoaded,
		products: products.length,
		filteredProducts: filteredProducts.length,
		totalItems,
		totalPages,
		page,
	});

	// Number of skeleton cards to show during loading
	const SKELETON_COUNT = 8;

	// Only show skeleton if we're loading AND we don't have any products cached
	const showSkeleton = isLoading && !hasLoaded && products.length === 0;

	return (
		<div>
			<MainNav />
			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="py-24">
					<h1 className="text-4xl font-bold tracking-tight">
						Our Collection
					</h1>

					{/* Filters and Sort */}
					<div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
						<CategoryFilter />
						<SortSelect />
					</div>

					{/* Product count */}
					<p className="mt-4 text-sm text-gray-500">
						Showing {filteredProducts.length} of {totalItems}{" "}
						products
					</p>

					{error && (
						<Alert variant="destructive" className="mt-6">
							{error}
						</Alert>
					)}

					<div className="mt-6 transition-all duration-500">
						<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
							{showSkeleton
								? Array(SKELETON_COUNT)
										.fill(null)
										.map((_, index) => (
											<ProductCardSkeleton key={index} />
										))
								: filteredProducts.map((product) => (
										<div
											key={product.id}
											className="animate-in fade-in duration-500"
										>
											<ProductCard product={product} />
										</div>
								  ))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<Pagination
								currentPage={page}
								totalPages={totalPages}
								onPageChange={setPage}
							/>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

export default CatalogPage;
