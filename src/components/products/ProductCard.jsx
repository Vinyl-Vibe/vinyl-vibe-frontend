import { Link } from "react-router-dom";

/* 
    ProductCard: Individual product display
    - Shows product image, title, price
    - Links to product detail page
    - Will add "Add to Cart" functionality later
*/
function ProductCard({ product }) {
    const {
        _id,
        name,
        price,
        type,
        brand,
        albumInfo,
        product_images = [],
        thumbnail,
    } = product;

    // Get the artist name from albumInfo if it exists
    const artistOrBrand = albumInfo?.artist || brand;

    return (
        <div
            className="group relative flex h-full w-full flex-col justify-between p-6 py-5 transition-colors duration-300 hover:bg-white"
            data-testid="product-card"
        >
            <div className="mb-2 flex justify-between">
                <p className="text-xs font-semibold uppercase">
                    {albumInfo?.artist?.trim()
                        ? brand
                            ? `${albumInfo.artist} : ${brand}`
                            : albumInfo.artist
                        : brand || ""}
                </p>
                <p className="text-xs font-medium uppercase">{type}</p>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img
                    src={thumbnail || "/missing_image.png"}
                    alt={name}
                    className={`h-full w-full scale-90 object-cover object-center ${thumbnail ? "" : "opacity-50"}`}
                />
            </div>

            <div className="mt-4 flex h-4 items-end justify-between gap-6">
                <h3 className="[text-box-trim: trim-both] [text-box-edge: cap alphabetic] text-base font-semibold tracking-[-0.02rem]">
                    <Link to={`/products/${_id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {name}
                    </Link>
                </h3>
                <p className="text-base tracking-[-0.02rem]">${price}</p>
            </div>
        </div>
    );
}

export default ProductCard;
