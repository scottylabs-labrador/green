import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Ignore build/config files
  {
    ignores: [
      'node_modules',
      'dist',
      '.expo',
      'build',
      'tailwind.config.js',
      'metro.config.js',
      'babel.config.js',
    ],
  },

  // TypeScript files — type-checked
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-native': reactNativePlugin,
      tailwindcss: tailwindcssPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
      ],
      'react-native/no-inline-styles': 'off',
      'react-native/sort-styles': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
  },

  // JavaScript files — no type-checking
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-native': reactNativePlugin,
      tailwindcss: tailwindcssPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'react-native/no-inline-styles': 'off',
      'react-native/sort-styles': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
];
