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
            <div className="aspect-square animate-pulse overflow-hidden rounded-lg bg-gray-200" />

            {/* Product Info skeleton */}
            <div className="flex flex-col">
                {/* Title skeleton */}
                <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />
                {/* Artist skeleton */}
                <div className="mt-2 h-7 w-1/2 animate-pulse rounded bg-gray-200" />
                {/* Price skeleton */}
                <div className="mt-4 h-8 w-24 animate-pulse rounded bg-gray-200" />

                {/* Details section skeleton */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <div className="mb-4 h-6 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="space-y-4">
                        {/* Genre skeleton */}
                        <div>
                            <div className="mb-1 h-5 w-16 animate-pulse rounded bg-gray-200" />
                            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                        </div>
                        {/* Year skeleton */}
                        <div>
                            <div className="mb-1 h-5 w-16 animate-pulse rounded bg-gray-200" />
                            <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                        </div>
                        {/* Condition skeleton */}
                        <div>
                            <div className="mb-1 h-5 w-24 animate-pulse rounded bg-gray-200" />
                            <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Button skeleton */}
                <div className="mt-8">
                    <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsSkeleton;
