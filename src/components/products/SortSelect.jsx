import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { SORT_OPTIONS, useProductStore } from "../../store/products";
import { useSearchParams, useLocation } from "react-router-dom";

function SortSelect() {
    const { sortBy } = useProductStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";

    // Create a human-readable label map for sort options
    const sortLabels = {
        PRICE_LOW: "Price: Low to High",
        PRICE_HIGH: "Price: High to Low",
        NEWEST: "Newest First",
        OLDEST: "Oldest First",
        NAME_AZ: "Name: A to Z",
        NAME_ZA: "Name: Z to A",
    };

    const handleSortChange = (sortKey) => {
        const newParams = new URLSearchParams(searchParams);

        // Add or update sort parameter
        if (sortKey !== "NEWEST") {
            newParams.set("sort", SORT_OPTIONS[sortKey]);
        } else {
            newParams.delete("sort");
        }

        // Keep existing parameters
        if (isSearchPage) {
            const search = searchParams.get("q");
            if (search) newParams.set("q", search);
        }
        const type = searchParams.get("type");
        if (type) newParams.set("type", type);

        // Remove page parameter to reset to page 1
        newParams.delete("page");

        // Update URL
        setSearchParams(newParams);
    };

    // Get current sort from URL
    const currentSortValue = searchParams.get("sort");
    const currentSortKey =
        Object.entries(SORT_OPTIONS).find(
            ([_, value]) => value === currentSortValue,
        )?.[0] || "NEWEST";

    return (
        <Select
            value={currentSortKey}
            onValueChange={handleSortChange}
            data-testid="sort-select"
        >
            <SelectTrigger className="h-12 w-[180px]">
                <SelectValue placeholder="Sort by...">
                    {sortLabels[currentSortKey] || "Sort by..."}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
                {Object.keys(SORT_OPTIONS).map((key) => (
                    <SelectItem
                        key={key}
                        value={key}
                        data-testid={`sort-option-${key}`}
                    >
                        {sortLabels[key]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default SortSelect;
