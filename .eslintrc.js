// .eslintrc.js
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
    "tailwindcss/no-custom-classname": "off",

    // Tailwind linting rules → strict locally, off in Vercel
    "tailwindcss/classnames-order": process.env.VERCEL ? "off" : "error",
    "tailwindcss/enforces-shorthand": process.env.VERCEL ? "off" : "error"
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
}
