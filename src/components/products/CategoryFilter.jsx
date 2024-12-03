import { Button } from "../ui/button";
import { CATEGORIES, useProductStore } from "../../store/products";

function CategoryFilter() {
	const { activeCategory, setCategory } = useProductStore();

	return (
		<div className="flex gap-2 flex-wrap" data-testid="category-filter">
			{Object.entries(CATEGORIES).map(([key, value]) => (
				<Button
					key={value}
					variant={activeCategory === value ? "default" : "secondary"}
					onClick={() => setCategory(value)}
					data-testid={`category-${value}`}
				>
					{key.charAt(0) +
						key.slice(1).toLowerCase().replace("_", " ")}
				</Button>
			))}
		</div>
	);
}

export default CategoryFilter;
