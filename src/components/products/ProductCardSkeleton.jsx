/* 
    ProductCardSkeleton: Loading placeholder for ProductCard
    - Uses responsive sizing to match ProductCard
    - Maintains aspect ratio across screen sizes
    - Uses Tailwind's pulse animation
*/
function ProductCardSkeleton({ count = 12 }) {
    return Array(count)
        .fill(null)
        .map((_, index) => (
            <div
                key={`skeleton-${index}`}
                className="group relative flex h-full w-full flex-col p-6 ring-1 ring-border/50 ring-offset-0"
                data-testid="product-skeleton"
            >
                {/* Top row */}
                <div className="mb-4 flex w-full justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200/50" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200/50" />
                </div>

                {/* Center image container */}
                <div className="relative aspect-square w-full">
                    {/* Centered scaled image */}
                    <div className="absolute left-1/2 top-1/2 aspect-square w-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse overflow-hidden rounded-lg bg-gray-200/50">
                        <div className="h-full w-full" />
                    </div>
                </div>

                {/* Bottom row */}
                <div className="mt-4 flex w-full justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200/50" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200/50" />
                </div>
            </div>
        ));
}

export default ProductCardSkeleton;
