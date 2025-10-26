import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get current file path in ES modules context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat for converting old ESLint configs to flat config format
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint configuration for Next.js with TypeScript
const eslintConfig = [
  // Extend Next.js recommended configs (Core Web Vitals + TypeScript rules)
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Ignore patterns - files/folders to exclude from linting
    ignores: [
      "node_modules/**",   // Dependencies
      ".next/**",          // Next.js build output
      "out/**",            // Next.js static export output
      "build/**",          // Additional build artifacts
      "next-env.d.ts",     // Next.js TypeScript declarations
    ],
  },
];

export default eslintConfig;
