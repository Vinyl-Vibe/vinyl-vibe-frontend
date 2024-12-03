import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import App from "../App";

// Mock all route components
vi.mock("../routes/public/HomePage", () => ({
	default: () => <h1>Welcome to Vinyl Vibe</h1>,
}));

vi.mock("../routes/public/AuthPage", () => ({
	default: () => (
		<div>
			<div className="font-semibold">Welcome to Vinyl Vibe</div>
			<button>Login</button>
		</div>
	),
}));

vi.mock("../routes/protected/CheckoutPage", () => ({
	default: () => <h1>Checkout</h1>,
}));

vi.mock("../routes/admin/DashboardPage", () => ({
	default: () => <h1>Admin Dashboard</h1>,
}));

vi.mock("../routes/error/ForbiddenPage", () => ({
	default: () => <h1>403 - Forbidden</h1>,
}));

vi.mock("../routes/error/NotFoundPage", () => ({
	default: () => <h1>404 - Not Found</h1>,
}));

describe("App", () => {
	beforeEach(() => {
		useAuthStore.setState({
			isAuthenticated: false,
			isAdmin: false,
		});
	});

	it("should render home page at root route", () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<App />
			</MemoryRouter>
		);
		expect(screen.getByText("Welcome to Vinyl Vibe")).toBeInTheDocument();
	});

	it("should render auth page for unauthenticated users trying to access protected routes", () => {
		render(
			<MemoryRouter initialEntries={["/checkout"]}>
				<App />
			</MemoryRouter>
		);
		expect(screen.getByText("Login")).toBeInTheDocument();
	});

	it("should render checkout page for authenticated users", () => {
		useAuthStore.setState({ isAuthenticated: true });
		render(
			<MemoryRouter initialEntries={["/checkout"]}>
				<App />
			</MemoryRouter>
		);
		expect(screen.getByText("Checkout")).toBeInTheDocument();
	});

	it("should render admin dashboard for admin users", () => {
		useAuthStore.setState({
			isAuthenticated: true,
			isAdmin: true,
		});
		render(
			<MemoryRouter initialEntries={["/admin"]}>
				<App />
			</MemoryRouter>
		);
		expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
	});

	it("should render forbidden page for non-admin users trying to access admin routes", () => {
		useAuthStore.setState({
			isAuthenticated: true,
			isAdmin: false,
		});
		render(
			<MemoryRouter initialEntries={["/admin"]}>
				<App />
			</MemoryRouter>
		);
		expect(screen.getByText("403 - Forbidden")).toBeInTheDocument();
	});

	it("should render not found page for invalid routes", () => {
		render(
			<MemoryRouter initialEntries={["/invalid-route"]}>
				<App />
			</MemoryRouter>
		);
		expect(screen.getByText("404 - Not Found")).toBeInTheDocument();
	});
});
