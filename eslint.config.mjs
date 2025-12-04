/* eslint-disable import/no-extraneous-dependencies */

import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import prettierPlugin from 'eslint-plugin-prettier';
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...fixupConfigRules(compat.extends('airbnb-base', 'plugin:jest/recommended')),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      prettier: fixupPluginRules(prettierPlugin),
      jest: fixupPluginRules(jestPlugin),
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/.stryker-tmp/sandbox-aQgjgv',
      '**/.stryker-tmp/sandbox-AUhp03',
      '**/.stryker-tmp/sandbox-c6S6Ps',
      'cypress.config.js',
      'src/services/tasksService.js',
      'src/controllers/tasksController.js',
      'src/controllers/usersController.js',
      '__tests__/unit/tasksService.test.js',
      '__tests__/integration/tasks.integration.test.js',
      '__tests__/integration/users.integration.test.js',
      'cypress/e2e/api.cy.js',
    ],
  },
];
