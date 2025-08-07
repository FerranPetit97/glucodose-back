// @ts-check
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    ignores: [
      'eslint.config.mjs',
      'node_modules',
      'dist',
      'coverage',
      '*.js',
      'migrations',
    ],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
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
