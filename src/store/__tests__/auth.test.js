import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "../auth";
import { authApi } from "../../api/auth";

// Mock the auth API
vi.mock("../../api/auth", () => ({
	authApi: {
		login: vi.fn(),
		logout: vi.fn(),
		getCurrentUser: vi.fn(),
		register: vi.fn(),
	},
}));

describe("Auth Store", () => {
	beforeEach(() => {
		// Clear all mocks and reset store between tests
		vi.clearAllMocks();
		localStorage.getItem.mockImplementation(() => null);
		localStorage.setItem.mockImplementation((key, value) => {
			localStorage.getItem.mockImplementation(k => k === key ? value : null);
		});
		useAuthStore.getState().logout();
		localStorage.clear();
	});

	it("should initialize with default values", () => {
		const state = useAuthStore.getState();
		expect(state.user).toBeNull();
		expect(state.isLoading).toBe(false);
		expect(state.error).toBeNull();
		expect(state.isAuthenticated).toBe(false);
		expect(state.isAdmin).toBe(false);
	});

	it("should handle successful login", async () => {
		const mockUser = { id: 1, email: "test@test.com", isAdmin: true };
		const mockResponse = { user: mockUser, token: "fake-token" };

		authApi.login.mockResolvedValueOnce(mockResponse);

		const credentials = { email: "test@test.com", password: "password" };
		await useAuthStore.getState().login(credentials);

		expect(localStorage.getItem("token")).toBe("fake-token");
		expect(useAuthStore.getState().user).toEqual(mockUser);
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
		expect(useAuthStore.getState().isAdmin).toBe(true);
	});

	it("should handle login failure", async () => {
		const error = new Error("Invalid credentials");
		error.response = { data: { message: "Invalid credentials" } };
		authApi.login.mockRejectedValueOnce(error);

		const credentials = { email: "test@test.com", password: "wrong" };

		await expect(
			useAuthStore.getState().login(credentials)
		).rejects.toThrow();
		expect(useAuthStore.getState().error).toBe("Invalid credentials");
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
	});

	it("should handle successful registration", async () => {
		const mockUser = { id: 1, email: "test@test.com", isAdmin: false };
		const mockResponse = { user: mockUser, token: "fake-token" };

		authApi.register.mockResolvedValueOnce(mockResponse);

		const userData = {
			name: "Test User",
			email: "test@test.com",
			password: "password",
		};
		await useAuthStore.getState().register(userData);

		expect(localStorage.getItem("token")).toBe("fake-token");
		expect(useAuthStore.getState().user).toEqual(mockUser);
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
	});

	it("should handle registration failure", async () => {
		const error = new Error("Email already exists");
		error.response = { data: { message: "Email already exists" } };
		authApi.register.mockRejectedValueOnce(error);

		const userData = {
			name: "Test User",
			email: "test@test.com",
			password: "password",
		};

		await expect(
			useAuthStore.getState().register(userData)
		).rejects.toThrow();
		expect(useAuthStore.getState().error).toBe("Email already exists");
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
	});

	it("should handle logout", async () => {
		// First login
		const mockUser = { id: 1, email: "test@test.com", isAdmin: false };
		useAuthStore.setState({
			user: mockUser,
			isAuthenticated: true,
		});
		vi.clearAllMocks();
		localStorage.getItem.mockImplementation(() => "fake-token");

		// Then logout
		await useAuthStore.getState().logout();

		expect(localStorage.removeItem).toHaveBeenCalledWith("token");
		expect(useAuthStore.getState().user).toBeNull();
		expect(useAuthStore.getState().isAuthenticated).toBe(false);
		expect(authApi.logout).toHaveBeenCalled();
	});

	it("should load user if token exists", async () => {
		const mockUser = { id: 1, email: "test@test.com", isAdmin: true };
		localStorage.setItem("token", "fake-token");
		authApi.getCurrentUser.mockResolvedValueOnce(mockUser);

		await useAuthStore.getState().loadUser();

		expect(useAuthStore.getState().user).toEqual(mockUser);
		expect(useAuthStore.getState().isAuthenticated).toBe(true);
		expect(useAuthStore.getState().isAdmin).toBe(true);
	});

	it("should not load user if no token exists", async () => {
		localStorage.clear();
		await useAuthStore.getState().loadUser();

		expect(authApi.getCurrentUser).not.toHaveBeenCalled();
		expect(useAuthStore.getState().user).toBeNull();
	});
});
