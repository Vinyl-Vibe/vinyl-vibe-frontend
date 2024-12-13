import { Button } from "../ui/button";
import { CATEGORIES, useProductStore } from "../../store/products";

function CategoryFilter() {
    const { activeCategory, setCategory } = useProductStore();

    return (
        <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([key, value]) => (
                <Button
                    key={key}
                    variant={activeCategory === value ? "default" : "secondary"}
                    onClick={() => setCategory(value)}
                    className="text-sm"
                >
                    {key === 'ALL' ? 'All Products' : key.charAt(0) + key.slice(1).toLowerCase()}
                </Button>
            ))}
        </div>
    );
}

export default CategoryFilter;
