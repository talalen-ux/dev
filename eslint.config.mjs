import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import globals from "globals";

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
  ]),
  /**
   * The keeper and its tests are plain .mjs, and nothing was checking them for
   * references to variables that do not exist: tsc only reads .ts, and the Next
   * TypeScript config turns no-undef off because tsc normally covers it. So a
   * rename inside scripts/keeper.mjs could leave a dangling identifier that
   * both gates passed and only a live tick would find — which is exactly how
   * `board.volatility` survived a refactor in this file's own history.
   *
   * This is production code. It gets the check.
   */
  {
    files: ["scripts/**/*.mjs", "test/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
    rules: { "no-undef": "error" },
  },
]);

export default eslintConfig;
