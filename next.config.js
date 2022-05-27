/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const withTM = require("next-transpile-modules")(["@babel/preset-react"]);

const nextConfig = withTM({
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.js", "page.jsx", "page.ts"],
  i18n: i18n,
});

module.exports = nextConfig;
