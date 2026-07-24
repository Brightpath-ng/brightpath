import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import base from "./base.mjs";

export default [
  ...base,
  {
    ignores: ["next-env.d.ts", ".next/**"],
  },
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
