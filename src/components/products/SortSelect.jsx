import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { SORT_OPTIONS, useProductStore } from "../../store/products";

function SortSelect({ onSortChange }) {
    const { sortBy, setSortBy } = useProductStore();

    const handleSortChange = (option) => {
        if (onSortChange) {
            onSortChange(option);
        } else {
            setSortBy(option);
        }
    };

    // Create a human-readable label map for sort options
    const sortLabels = {
        PRICE_LOW: "Price: Low to High",
        PRICE_HIGH: "Price: High to Low",
        NEWEST: "Newest First",
        NAME_AZ: "Name: A to Z",
        NAME_ZA: "Name: Z to A"
    };

    return (
        <Select
            value={sortBy}
            onValueChange={handleSortChange}
            data-testid="sort-select"
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
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
