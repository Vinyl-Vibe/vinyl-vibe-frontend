import { useEffect } from "react";
import MainNav from "../../components/layout/MainNav";
import ProductCard from "../../components/products/ProductCard";
import CategoryFilter from "../../components/products/CategoryFilter";
import SortSelect from "../../components/products/SortSelect";
import ProductCardSkeleton from "../../components/products/ProductCardSkeleton";
import { useProductStore } from "../../store/products";
import { Alert } from "../../components/ui/alert";

/* 
  CatalogPage: Product listing page
  - Displays grid of ProductCards
  - Handles loading and error states
  - Will add filtering/sorting later
*/
function CatalogPage() {
	const { isLoading, error, fetchProducts, getFilteredProducts } =
		useProductStore();

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const filteredProducts = getFilteredProducts();

	// Number of skeleton cards to show during loading
	const SKELETON_COUNT = 8;

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

					{error && (
						<Alert variant="destructive" className="mt-6">
							{error}
						</Alert>
					)}

					<div className="mt-6 transition-all duration-500">
						<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
							{isLoading
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
					</div>
				</div>
			</main>
		</div>
	);
}

export default CatalogPage;
