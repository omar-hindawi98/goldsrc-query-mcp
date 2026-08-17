import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		projects: [
			{
				test: {
					name: "unit",
					globals: true,
					include: ["src/**/*.spec.ts"],
				},
			},
			{
				test: {
					name: "e2e",
					globals: true,
					include: ["tests/*.test.ts"],
					testTimeout: 30_000,
					hookTimeout: 15_000,
				},
			},
		],
	},
});
