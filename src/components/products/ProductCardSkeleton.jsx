/* 
    ProductCardSkeleton: Loading placeholder for ProductCard
    - Uses responsive sizing to match ProductCard
    - Maintains aspect ratio across screen sizes
    - Uses Tailwind's pulse animation
*/
function ProductCardSkeleton() {
    return (
        <div
            className="group relative h-full w-full border-[0.5px] p-6"
            data-testid="product-skeleton"
        >
            {/* Image skeleton - maintain aspect ratio and full width */}
            <div className="aspect-square w-full animate-pulse overflow-hidden rounded-lg bg-gray-200">
                {/* Maintain aspect ratio */}
                <div className="h-full w-full" />
            </div>

            {/* Content skeleton - match exact spacing and dimensions of ProductCard */}
            <div className="mt-4 flex justify-between">
                <div>
                    {/* Title skeleton - match text-sm font-medium dimensions */}
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                    {/* Artist skeleton - match text-sm text-gray-500 dimensions */}
                    <div className="mt-1 h-5 w-24 animate-pulse rounded bg-gray-200 opacity-75" />
                </div>
                {/* Price skeleton - match text-sm font-medium dimensions */}
                <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
