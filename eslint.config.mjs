import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non-project folders living in the repo root (python venvs, raw design drops):
    "LTX-2/**",
    "HEYTIGER NEW ASSETS/**",
    "hey-tiger-video/**",
    "moodboard/**",
    "public/**",
  ]),
]);

export default eslintConfig;
