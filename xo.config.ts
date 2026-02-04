import type { FlatXoConfig } from 'xo'

export default [
  {
    files: ['**/*.{ts,js,mjs,json}'],
    rules: {
      'no-console': 'error',
      'no-unused-vars': 'error',
      '@typescript-eslint/no-floating-promises': 'off',
      'unicorn/filename-case': ['error', { case: 'snakeCase' }],
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@stylistic/object-curly-spacing': 'off',
      '@stylistic/indent': ['error', 2],
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/function-paren-newline': 'off',
      '@stylistic/comma-dangle': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/indent-binary-ops': 'off',
      'max-params': 'off',
      'new-cap': 'off',
      curly: 'off',
      'no-warning-comments': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@stylistic/semi': 'off', // We don't use semicolons here.
    },
  },
  {
    files: ['src/index.ts'],
    rules: {
      'no-unused-vars': 'off',
      'unicorn/prefer-top-level-await': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['mikro-orm.config.ts'],
    rules: {
      '@stylistic/operator-linebreak': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    files: ['**/*.{config,entity,middleware}.ts'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/prevent-abbreviations': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
    },
  },
  {
    files: ['**/*.entity.ts'],
    rules: {
      'new-cap': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@stylistic/object-curly-newline': 'off',
      '@stylistic/quotes': 'off',
    },
  },
  {
    files: ['**/*.constant.ts', '**/constants.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variableLike', format: ['UPPER_CASE'] },
      ],
      '@stylistic/quotes': 'off',
      '@stylistic/operator-linebreak': 'off',
    },
  },
  {
    files: ['setup.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['./src/events/*.ts'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
    },
  },
  {
    ignores: [
      '**/node_modules/',
      '**/cache/',
      '**/temp/',
      '**/dist/',
      '**/tsconfig*',
      '**/package-lock.json',
      '**/package.json',
      '**/bun.lock',
    ],
  },
] satisfies FlatXoConfig[]
