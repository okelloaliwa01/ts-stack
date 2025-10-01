import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import simpleImport from "eslint-plugin-simple-import-sort";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
        parser: tsparser,
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
    },
    plugins: {
        "@typescript-eslint": tseslint,
        prettier,
        'simple-import-sort': simpleImport,
    },
    rules: {
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
