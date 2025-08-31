const disableRules = process.env.DISABLE_REACT_RULES === "true";

module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "prettier",
    "plugin:tailwindcss/recommended"
  ],
  plugins: ["tailwindcss"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "tailwindcss/no-custom-classname": disableRules ? "off" : "error",
    "tailwindcss/classnames-order": disableRules ? "off" : "error",
    "react/no-unescaped-entities": disableRules ? "off" : "error"
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "tailwind.config.ts"
    },
    next: {
      rootDir: true
    }
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser"
    }
  ]
};
