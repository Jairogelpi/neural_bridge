import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

const eslintConfig = defineConfig([
  // Extending configs in flat config style might be different, but assuming they are objects or arrays of objects.
  // If they are single objects (flat config compatible), spreading them might be wrong if they are not iterables.
  // However, usually they are arrays.
  // Converting to: atomic updates if they are arrays.
  // Actually, let's just assume they are arrays of objects and use flat() or just remove spreads if they are single objects.
  // But safest is to flatten.

  // Correction: If they are NOT iterable, they are objects.
  // Let's try putting them as items in the array without spread.
  nextVitals,
  nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
