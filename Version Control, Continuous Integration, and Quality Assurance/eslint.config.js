import js from "@eslint/js";

export default [
  {
    ignores: ["coverage/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "test/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly"
      }
    }
  }
];
