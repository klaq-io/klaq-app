module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'filenames-simple'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.service.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'warn',
        'filenames-simple/naming-convention': [
          'error',
          {
            // Use custom regexp to match migration file
            rule: 'kebab-case',
          },
        ],
      },
    },
    {
      files: ['*.dto.ts'],
      rules: {
        'filenames-simple/naming-convention': [
          'error',
          {
            // Use custom regexp to match migration file
            rule: 'kebab-case',
          },
        ],
      },
    },
  ],
};
