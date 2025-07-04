const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const eslintPluginReactQuery = require("@tanstack/eslint-plugin-query")

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  eslintPluginReactQuery,
  {
    ignores: ["dist/*"],
  },
]);
