import { Link } from "react-router-dom";

/* 
    ProductCard: Individual product display
    - Shows product image, title, price
    - Links to product detail page
    - Will add "Add to Cart" functionality later
*/
function ProductCard({ product }) {
    const { id, title, artist, price, thumb_image } = product;

    return (
        <div
            className="group relative flex h-full w-full flex-col justify-between border-[0.5px] p-6 py-5 transition-colors duration-300 hover:bg-white"
            data-testid="product-card"
        >
            <div className="mb-2 flex justify-between">
                <p className="text-xs font-medium uppercase">{artist}</p>
                <p className="text-sm font-medium">${price}</p>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img
                    src={thumb_image || "/missing_image.png"}
                    alt={title}
                    className={`h-full w-full scale-90 object-cover object-center ${thumb_image ? "" : "opacity-50"}`}
                />
            </div>

            <div className="mt-4 flex justify-between">
                <h3 className="text-base font-semibold tracking-[-0.02rem]">
                    <Link to={`/products/${id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {title}
                    </Link>
                </h3>
                <p className="text-base tracking-[-0.02rem]">${price}</p>
            </div>
        </div>
    );
}

export default ProductCard;
