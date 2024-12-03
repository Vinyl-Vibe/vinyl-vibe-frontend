import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CATEGORIES, useProductStore } from "../../../store/products";
import CategoryFilter from "../CategoryFilter";

// Mock the store
vi.mock("../../../store/products", () => ({
	CATEGORIES: {
		ALL: "all",
		VINYL: "vinyl",
		TURNTABLES: "turntables",
	},
	useProductStore: vi.fn(),
}));

describe("CategoryFilter", () => {
	const setCategory = vi.fn();

	beforeEach(() => {
		useProductStore.mockReturnValue({
			activeCategory: CATEGORIES.ALL,
			setCategory,
		});
	});

	it("should render all category buttons", () => {
		render(<CategoryFilter />);

		const filter = screen.getByTestId("category-filter");
		expect(filter).toBeInTheDocument();

		Object.entries(CATEGORIES).forEach(([key, value]) => {
			expect(screen.getByTestId(`category-${value}`)).toBeInTheDocument();
		});
	});

	it("should highlight active category", () => {
		useProductStore.mockReturnValue({
			activeCategory: CATEGORIES.VINYL,
			setCategory,
		});

		render(<CategoryFilter />);

		const vinylButton = screen.getByTestId("category-vinyl");
		expect(vinylButton).toHaveClass("bg-primary");
	});

	it("should call setCategory when clicked", () => {
		render(<CategoryFilter />);

		fireEvent.click(screen.getByTestId("category-vinyl"));
		expect(setCategory).toHaveBeenCalledWith(CATEGORIES.VINYL);
	});
});
