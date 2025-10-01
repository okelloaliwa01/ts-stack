import eslintJs from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";
import typescriptEslint from "typescript-eslint";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReact from "eslint-plugin-react";
import tanstackEslintPluginQuery from '@tanstack/eslint-plugin-query';
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const reactConfig = [
  ...baseConfig,
  eslintJs.configs.recommended,
  eslintConfigPrettier,
  ...typescriptEslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...eslintPluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": eslintPluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    plugins: {
      "@tanstack/query": tanstackEslintPluginQuery,
    },
  },
];
