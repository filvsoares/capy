import eslint from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

function rule(module, from, allow) {
  return {
    from: [['bean', { module, component: from }]],
    allow: allow.map((e) => ['bean', { module, component: e }]),
  };
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
              from: [['bean', { module: 'codegen' }]],
              allow: [['bean', { module: 'parser' }]],
            },
            rule('codegen', 'expression', ['codegen']),
            rule('codegen', 'global-variable', ['codegen', 'expression']),
            rule('codegen', 'method', ['codegen', 'expression', 'statement']),
            rule('codegen', 'operation', ['codegen', 'expression']),
            rule('codegen', 'statement', ['codegen', 'expression']),
            rule('parser', 'expression', ['parser', 'tokenizer', 'type']),
            rule('parser', 'global-variable', ['expression', 'parser', 'tokenizer', 'type']),
            rule('parser', 'method', ['expression', 'operation', 'parser', 'statement', 'tokenizer', 'type']),
            rule('parser', 'operation', ['expression', 'parser', 'tokenizer', 'type']),
            rule('parser', 'parser', ['tokenizer']),
            rule('parser', 'statement', ['expression', 'parser', 'tokenizer']),
            rule('parser', 'tokenizer', []),
            rule('parser', 'type', ['parser', 'tokenizer']),
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
          pattern: 'modules/*/*',
          capture: ['module', 'component'],
        },
      ],
    },
  },
]);
