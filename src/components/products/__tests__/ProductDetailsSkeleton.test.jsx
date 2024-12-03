import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductDetailsSkeleton from "../ProductDetailsSkeleton";

describe("ProductDetailsSkeleton", () => {
	it("should render all skeleton elements", () => {
		render(<ProductDetailsSkeleton />);

		const skeleton = screen.getByTestId("product-details-skeleton");
		expect(skeleton).toBeInTheDocument();

		// Check for animated elements
		const animatedElements =
			skeleton.getElementsByClassName("animate-pulse");
		expect(animatedElements.length).toBeGreaterThan(0);
	});

	it("should match product details layout", () => {
		const { container } = render(<ProductDetailsSkeleton />);

		// Check for all major sections
		expect(container.querySelector(".border-t")).toBeInTheDocument(); // Details section
		expect(container.querySelector(".space-y-4")).toBeInTheDocument(); // Details grid
		expect(container.querySelector(".mt-8")).toBeInTheDocument(); // Button section
	});
});
