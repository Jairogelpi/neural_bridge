import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
            "no-case-declarations": "warn",
            "no-empty": "warn",
            "prefer-const": "warn"
        }
    },
    {
        ignores: ["dist/", "node_modules/"]
    }
);
