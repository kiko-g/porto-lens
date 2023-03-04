/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  printWidth: 100,
  singleQuote: true,
  semi: true,
  useTabs: false,
  tabWidth: 2,
};

module.exports = config;
