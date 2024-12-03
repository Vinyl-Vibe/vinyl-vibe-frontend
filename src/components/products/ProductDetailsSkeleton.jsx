/* 
  ProductDetailsSkeleton: Loading placeholder for product details
  - Matches ProductPage layout exactly
  - Uses consistent animation with ProductCardSkeleton
  - Shows placeholder for all product information
*/
function ProductDetailsSkeleton() {
	return (
		<div
			className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2"
			data-testid="product-details-skeleton"
		>
			{/* Image skeleton */}
			<div className="aspect-square overflow-hidden rounded-lg bg-gray-200 animate-pulse" />

			{/* Product Info skeleton */}
			<div className="flex flex-col">
				{/* Title skeleton */}
				<div className="h-9 bg-gray-200 rounded animate-pulse w-3/4" />
				{/* Artist skeleton */}
				<div className="mt-2 h-7 bg-gray-200 rounded animate-pulse w-1/2" />
				{/* Price skeleton */}
				<div className="mt-4 h-8 bg-gray-200 rounded animate-pulse w-24" />

				{/* Details section skeleton */}
				<div className="mt-8 border-t border-gray-200 pt-8">
					<div className="h-6 bg-gray-200 rounded animate-pulse w-20 mb-4" />
					<div className="space-y-4">
						{/* Genre skeleton */}
						<div>
							<div className="h-5 bg-gray-200 rounded animate-pulse w-16 mb-1" />
							<div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
						</div>
						{/* Year skeleton */}
						<div>
							<div className="h-5 bg-gray-200 rounded animate-pulse w-16 mb-1" />
							<div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
						</div>
						{/* Condition skeleton */}
						<div>
							<div className="h-5 bg-gray-200 rounded animate-pulse w-24 mb-1" />
							<div className="h-6 bg-gray-200 rounded animate-pulse w-28" />
						</div>
					</div>
				</div>

				{/* Button skeleton */}
				<div className="mt-8">
					<div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
				</div>
			</div>
		</div>
	);
}

export default ProductDetailsSkeleton;
