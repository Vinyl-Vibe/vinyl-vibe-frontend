import { Link } from "react-router-dom";

/* 
  ProductCard: Individual product display
  - Shows product image, title, price
  - Links to product detail page
  - Will add "Add to Cart" functionality later
*/
function ProductCard({ product }) {
	const { id, title, artist, price, imageUrl } = product;

	return (
		<div
			className="group border-[0.5px] relative h-full w-full p-6"
			data-testid="product-card"
		>
			<div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
				<img
					src={imageUrl}
					alt={title}
					className="h-full w-full object-cover object-center"
				/>
			</div>
			<div className="mt-4 flex justify-between">
				<div>
					<h3 className="text-sm font-medium">
						<Link to={`/products/${id}`}>
							<span
								aria-hidden="true"
								className="absolute inset-0"
							/>
							{title}
						</Link>
					</h3>
					<p className="mt-1 text-sm text-gray-500">{artist}</p>
				</div>
				<p className="text-sm font-medium">${price}</p>
			</div>
		</div>
	);
}

export default ProductCard;
