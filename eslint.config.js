import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/src-tauri/**',
      '**/target/**',
      '**/*.gen.*',
      '**/generated/**',
    ],
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Relaxed rules for MVP
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Primitives boundary rule: Only @gouide/frontend-ui can import primitives
  // This applies to all packages and apps EXCEPT the UI package and primitives packages themselves
  {
    files: [
      'packages/**/*.ts',
      'packages/**/*.tsx',
      'apps/**/*.ts',
      'apps/**/*.tsx',
    ],
    ignores: [
      'packages/frontend/shared/ui/**/*',
      'packages/frontend/primitives/**/*',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@gouide/primitives*', '**/primitives/*'],
              message:
                'Primitives can only be imported by atoms in @gouide/frontend-ui. Import from @gouide/frontend-ui instead.',
            },
          ],
        },
      ],
    },
  },

  // Allow primitives imports within frontend-ui (atoms layer)
  {
    files: [
      'packages/frontend/shared/ui/**/*.ts',
      'packages/frontend/shared/ui/**/*.tsx',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // Allow primitives packages to import each other
  {
    files: [
      'packages/frontend/primitives/**/*.ts',
      'packages/frontend/primitives/**/*.tsx',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  }
);
