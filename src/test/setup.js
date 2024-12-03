import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers);

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(() => null),
	setItem: vi.fn(),
	clear: vi.fn(),
	removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock window.scrollTo
global.scrollTo = vi.fn();

// Cleanup after each test case
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});
