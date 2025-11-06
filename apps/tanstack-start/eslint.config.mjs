import baseConfig from "@repo/eslint-config/base.js";

export default [
  ...baseConfig,
  {
    ignores: ['.nitro/**', '.output/**', '.vinxi/**', 'dist/**'],
  },
];
