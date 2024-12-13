import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        include: ["src/**/__tests__/*.{test,spec}.{js,jsx}"],
        coverage: {
            reporter: ["text", "json", "html"],
            include: ["src/**/*.{js,jsx}"],
            exclude: [
                "src/**/*.{test,spec}.{js,jsx}",
                "src/test/**/*",
                "src/**/__tests__/**/*",
            ],
        },
    },
});
