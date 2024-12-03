import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SORT_OPTIONS, useProductStore } from "../../../store/products";
import SortSelect from "../SortSelect";

// Mock the store
vi.mock("../../../store/products", () => ({
	SORT_OPTIONS: {
		NEWEST: "newest",
		PRICE_LOW: "price-low",
	},
	useProductStore: vi.fn(),
}));

describe("SortSelect", () => {
	const setSortBy = vi.fn();

	beforeEach(() => {
		useProductStore.mockReturnValue({
			sortBy: SORT_OPTIONS.NEWEST,
			setSortBy,
		});
	});

	it("should render sort options", () => {
		render(<SortSelect />);

		const select = screen.getByRole("combobox");
		expect(select).toBeInTheDocument();

		fireEvent.click(select);

		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(Object.keys(SORT_OPTIONS).length);

		expect(screen.getAllByText("Newest")[0]).toBeInTheDocument();
		expect(screen.getByText("Price Low")).toBeInTheDocument();
	});

	it("should call setSortBy when option selected", () => {
		render(<SortSelect />);

		fireEvent.click(screen.getByRole('combobox'));
		fireEvent.click(screen.getByText('Price Low'));

		expect(setSortBy).toHaveBeenCalledWith(SORT_OPTIONS.PRICE_LOW);
	});
});
