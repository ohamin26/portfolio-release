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
    files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}", "*.config.ts"],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [next.configs["core-web-vitals"]],
  },
  {
    files: ["src/common/**/*.{ts,tsx,js,jsx,mjs}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          regex: "^(?:@/|(?:\\.\\.?/)+(?:src/)?)app(?:/|$)",
          message: "공용 모듈에서 라우트 전용 코드를 가져올 수 없습니다.",
        }],
      }],
    },
  },
]);
