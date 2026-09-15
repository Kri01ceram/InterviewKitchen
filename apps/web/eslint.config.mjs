import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { sharedIgnores } from "@interview-kitchen/eslint-config";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores(sharedIgnores),
]);

export default eslintConfig;
