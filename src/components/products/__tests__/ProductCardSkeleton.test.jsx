import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCardSkeleton from "../ProductCardSkeleton";

describe("ProductCardSkeleton", () => {
	it("should render skeleton elements with animation", () => {
		render(<ProductCardSkeleton />);

		const skeleton = screen.getByTestId("product-skeleton");
		expect(skeleton).toBeInTheDocument();

		// Check for animated elements
		const animatedElements =
			skeleton.getElementsByClassName("animate-pulse");
		expect(animatedElements.length).toBeGreaterThan(0);

		// Check for placeholder shapes
		expect(skeleton.querySelector(".aspect-square")).toBeInTheDocument();
	});
});
