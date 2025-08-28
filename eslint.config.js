import eslint from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

function bean(name) {
  return ['bean', { name }];
}

export default defineConfig([
  {
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    basePath: 'src',
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      boundaries,
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: [bean('compiler')],
              allow: ['bean'],
            },
            {
              from: [bean('expression')],
              allow: [bean('type'), bean('parser'), bean('tokenizer')],
            },
            {
              from: [bean('global-variable')],
              allow: [bean('expression'), bean('type'), bean('parser'), bean('tokenizer')],
            },
            {
              from: [bean('impexp')],
              allow: [bean('type'), bean('parser'), bean('tokenizer')],
            },
            {
              from: [bean('method')],
              allow: ['bean'],
            },
            {
              from: [bean('operation')],
              allow: [bean('expression'), bean('type'), bean('parser'), bean('tokenizer')],
            },
            {
              from: [bean('parser')],
              allow: [bean('tokenizer')],
            },
            {
              from: [bean('runner')],
              allow: ['bean'],
            },
            {
              from: [bean('statement')],
              allow: [bean('expression'), bean('type'), bean('parser'), bean('tokenizer')],
            },
            {
              from: [bean('tokenizer')],
              allow: [],
            },
            {
              from: [bean('type')],
              allow: [bean('parser'), bean('tokenizer')],
            },
            {
              from: [bean('variable')],
              allow: [bean('expression'), bean('type'), bean('parser'), bean('tokenizer')],
            },
          ],
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'boundaries/elements': [
        {
          type: 'bean',
          pattern: 'beans/*',
          capture: ['name'],
        },
      ],
    },
  },
]);
