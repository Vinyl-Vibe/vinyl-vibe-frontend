import { Button } from "../ui/button";
import { CATEGORIES, useProductStore } from "../../store/products";

function CategoryFilter({ onCategoryChange }) {
    const { activeCategory, setCategory } = useProductStore();

    const handleCategoryClick = (category) => {
        if (onCategoryChange) {
            onCategoryChange(category);
        } else {
            setCategory(category);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([key, value]) => (
                <Button
                    key={key}
                    variant={activeCategory === value ? "secondary" : ""}
                    onClick={() => handleCategoryClick(value)}
                    className={`text-sm ${activeCategory === value ? "hover:bg-accent" : ""}`}
                >
                    {key === 'ALL' ? 'All Products' : key.charAt(0) + key.slice(1).toLowerCase()}
                </Button>
            ))}
        </div>
    );
}

export default CategoryFilter;
