/* eslint-disable import/no-extraneous-dependencies */

import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...fixupConfigRules(compat.extends('airbnb-base')),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: fixupPluginRules(prettierPlugin),
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
    },
  },
  {
    ignores: ['**/node_modules/', '**/dist/', 'src/services/tasksService.js'],
  },
];
