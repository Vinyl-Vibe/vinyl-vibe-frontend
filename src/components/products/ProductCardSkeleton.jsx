/* 
  ProductCardSkeleton: Loading placeholder for ProductCard
  - Uses responsive sizing to match ProductCard
  - Maintains aspect ratio across screen sizes
  - Uses Tailwind's pulse animation
*/
function ProductCardSkeleton() {
	return (
		<div
			className="group relative h-full w-full"
			data-testid="product-skeleton"
		>
			{/* Image skeleton - maintain aspect ratio and full width */}
			<div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse">
				{/* Maintain aspect ratio */}
				<div className="h-full w-full" />
			</div>

			{/* Content skeleton - match exact spacing and dimensions of ProductCard */}
			<div className="mt-4 flex justify-between">
				<div>
					{/* Title skeleton - match text-sm font-medium dimensions */}
					<div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
					{/* Artist skeleton - match text-sm text-gray-500 dimensions */}
					<div className="mt-1 h-5 bg-gray-200 rounded animate-pulse w-24 opacity-75" />
				</div>
				{/* Price skeleton - match text-sm font-medium dimensions */}
				<div className="h-5 bg-gray-200 rounded animate-pulse w-12" />
			</div>
		</div>
	);
}

export default ProductCardSkeleton;
