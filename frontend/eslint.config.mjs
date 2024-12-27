import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';

import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    ignores: [
      '**/.next',
      '**/coverage',
      '**/node_modules',
      '**/next.config.js',
      '**/jest.config.js',
      '**/babel.config.js',
      '**/tailwind.config.js',
      '**/postcss.config.js',
      '**/node_modules',
      '**/__generated__',
      '**/dist',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
  ),
  {
    plugins: {
      'unused-imports': unusedImports,
      '@typescript-eslint': typescriptEslintEslintPlugin,
    },

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
      },
    },

    rules: {
      'react/forbid-component-props': [
        'warn',
        {
          forbid: [
            {
              propName: 'defaultMessage',
              message: 'Do not use defaultMessage on FormattedMessage',
            },
          ],
        },
      ],

      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.property.name='formatMessage'] Property[key.name='defaultMessage']",
          message: 'Do not use defaultMessage',
        },
      ],

      'react/forbid-elements': [
        'warn',
        {
          forbid: [
            {
              element: 'FormattedMessage',
              message: 'prefer using useIntl hook instead',
            },
          ],
        },
      ],

      'no-inner-declarations': 'off',
      eqeqeq: 'error',
      'no-var': 'error',
      'no-await-in-loop': 'error',
      'no-console': 'error',
      'no-promise-executor-return': 'error',
      'no-template-curly-in-string': 'error',
      'no-useless-backreference': 'error',
      'require-atomic-updates': 'error',
      'no-alert': 'error',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_[^_].*$|^_$',
          varsIgnorePattern: '^_[^_].*$|^_$',
          caughtErrorsIgnorePattern: '^_[^_].*$|^_$',
        },
      ],

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],

      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      'no-restricted-imports': [
        'error',
        {
          name: 'querystring',
          message: 'Please use URLSearchParams instead',
        },
      ],

      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index',
          ],
        },
      ],

      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
