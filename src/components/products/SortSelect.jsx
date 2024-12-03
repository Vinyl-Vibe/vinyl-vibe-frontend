import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { SORT_OPTIONS, useProductStore } from "../../store/products";

function SortSelect() {
	const { sortBy, setSortBy } = useProductStore();

	return (
		<Select
			value={sortBy}
			onValueChange={setSortBy}
			data-testid="sort-select"
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Sort by..." />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(SORT_OPTIONS).map(([key, value]) => (
					<SelectItem
						key={value}
						value={value}
						data-testid={`sort-option-${value}`}
					>
						{key
							.split("_")
							.map(
								(word) =>
									word.charAt(0) + word.slice(1).toLowerCase()
							)
							.join(" ")}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export default SortSelect;
