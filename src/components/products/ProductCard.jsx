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
			className="group border-[0.5px] flex flex-col justify-between relative h-full w-full p-6 py-5 hover:bg-white transition-colors duration-300"
			data-testid="product-card"
		>
			<div className="flex justify-between mb-2">
				<p className="text-xs font-medium uppercase">{artist}</p>
				<p className="text-sm font-medium">${price}</p>
			</div>

			<div className="aspect-square w-full overflow-hidden rounded-lg">
				<img
					src={thumb_image || "/missing_image.png"}
					alt={title}
					className={`h-full w-full object-cover object-center scale-90 ${thumb_image ? "" : "opacity-50"}`}
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
