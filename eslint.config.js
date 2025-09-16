import eslint from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

function rule(from, allow) {
  return {
    from: [['bean', { component: from }]],
    allow: allow.map((e) => ['bean', { component: e }]),
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
      ...reactHooks.configs.recommended.rules,
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
            rule('expression', ['codegen']),
            rule('global-variable', ['codegen', 'expression']),
            rule('method', ['codegen', 'expression', 'statement']),
            rule('operation', ['codegen', 'expression']),
            rule('statement', ['codegen', 'expression']),
            rule('io', ['base']),
            rule('expression', ['parser', 'tokenizer', 'type']),
            rule('global-variable', ['expression', 'parser', 'tokenizer', 'type']),
            rule('method', ['expression', 'operation', 'parser', 'statement', 'tokenizer', 'type']),
            rule('operation', ['expression', 'parser', 'tokenizer', 'type']),
            rule('parser', ['tokenizer']),
            rule('statement', ['expression', 'parser', 'tokenizer']),
            rule('tokenizer', []),
            rule('type', ['parser', 'tokenizer']),
            rule('use', ['parser', 'tokenizer']),
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
