import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { CATEGORIES } from "../../store/products";

function CategoryFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";

    // Get active category from URL params
    const activeCategory = searchParams.get("type") || CATEGORIES.ALL;

    const handleCategoryClick = (category) => {
        if (isSearchPage) {
            // For search page, preserve search query and update type
            const newParams = new URLSearchParams(searchParams);

            if (category !== CATEGORIES.ALL) {
                newParams.set("type", category);
            } else {
                newParams.delete("type");
            }

            // Reset to page 1
            newParams.delete("page");

            // Update URL with all params preserved
            setSearchParams(newParams);
        } else {
            // For catalog page, preserve sort and update type
            const newParams = new URLSearchParams();

            // Keep sort if exists
            const currentSort = searchParams.get("sort");
            if (currentSort) {
                newParams.set("sort", currentSort);
            }

            // Set category if not ALL
            if (category !== CATEGORIES.ALL) {
                newParams.set("type", category);
            }

            // Navigate to catalog with params
            const queryString = newParams.toString();
            navigate({
                pathname: "/products",
                search: queryString ? `?${queryString}` : "",
            });
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
                    {key === "ALL"
                        ? "All Products"
                        : key
                              .split("_")
                              .map(
                                  (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1).toLowerCase(),
                              )
                              .join(" ")}
                </Button>
            ))}
        </div>
    );
}

export default CategoryFilter;
