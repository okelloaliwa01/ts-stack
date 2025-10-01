import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use Hono.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const honoConfig = [
  ...baseConfig,
];
