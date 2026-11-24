import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    ".next/**", "out/**", "coverage/**", "next-env.d.ts", "playwright-report/**",
    "test-results/**", "worktrees/**", "logs/**",
  ]),
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended, next.configs["core-web-vitals"]],
  },
]);
