import { Button } from "../ui/button";
import { CATEGORIES, useProductStore } from "../../store/products";
import { useNavigate, useLocation } from "react-router-dom";

function CategoryFilter({ onCategoryChange }) {
    const { activeCategory, setCategory } = useProductStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCategoryClick = (category) => {
        // Map category types to URL slugs
        const categoryToSlug = {
            'all': '',
            'vinyl': 'vinyls',
            'turntable': 'turntables',
            'accessory': 'accessories',
            'merch': 'merch'
        };

        // Update store
        if (onCategoryChange) {
            onCategoryChange(category);
        } else {
            setCategory(category);
        }

        // Update URL
        const slug = categoryToSlug[category];
        if (slug) {
            navigate(`/products/${slug}`);
        } else {
            navigate('/products');
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
