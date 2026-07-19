// @ts-check
//
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig({
    files: ['**/*.{js,ts}'],
    extends: [
	js.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	],
    languageOptions: {
	parserOptions: {
	    projectService: true
	},
    },
}, prettierRecommended);
    
