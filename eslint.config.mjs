import js from "@eslint/js";
import solid from "eslint-plugin-solid/configs/typescript";
import * as tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    rules: {
      "solid/no-destructure": "error",
      "solid/jsx-no-undef": "error",
      "solid/components-return-once": "warn",
      "solid/event-handlers": "error",
      "solid/imports": "warn",
      "solid/jsx-no-duplicate-props": "error",
      "solid/jsx-no-script-url": "warn",
      "solid/jsx-uses-vars": "warn",
      "solid/no-array-handlers": "error",
      "solid/self-closing-comp": "error",
      "solid/reactivity": "warn",
      "solid/prefer-show": "warn",
      "solid/prefer-for": "warn",
      "solid/prefer-classlist": "warn",
      "solid/no-unknown-namespaces": "error",
      "solid/no-react-specific-props": "error",
      "solid/no-react-deps": "error",
      "solid/no-proxy-apis": "warn",
      "solid/no-innerhtml": "error",
      "no-unused-vars": "warn",
      "no-undef": "off",
    },
  },
  {
    ignores: [".output/**", "node_modules/**", "public/**"],
  },
];
