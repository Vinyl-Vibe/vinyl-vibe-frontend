import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../pagination";

describe("Pagination", () => {
	const onPageChange = vi.fn();

	it("should render pagination buttons", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("should handle page changes", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		fireEvent.click(screen.getByText("2"));
		expect(onPageChange).toHaveBeenCalledWith(2);
	});

	it("should disable previous button on first page", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
	});

	it("should disable next button on last page", () => {
		render(
			<Pagination
				currentPage={3}
				totalPages={3}
				onPageChange={onPageChange}
			/>
		);

		expect(screen.getByLabelText("Go to next page")).toBeDisabled();
	});
});
