module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["backend/functions/tsconfig.json", "backend/functions/tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["warn", "double"],
    "max-len": ["warn", "always"],
    "linebreak-style": "off",
    "object-curly-spacing": ["warn", "always"],
    "import/no-unresolved": 0,
    "indent": ["warn", 2],
    "@typescript-eslint/no-unused-vars": ["warn", {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: true,
    }],
  },
};
