module.exports = {
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  overrides: [
    // only for ts files
    {
      files: ['*.ts'],
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      extends: ['airbnb-typescript/base', 'plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'global-require': 'off',
    'no-param-reassign': 'off',
    'no-cond-assign': 'off',
    'no-restricted-syntax': 'off',
  },
};
