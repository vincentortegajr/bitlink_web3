module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['build', 'node_modules', '*.config.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Disable prop-types as we might be using TypeScript or prefer runtime checking
    'react/react-in-jsx-scope': 'off', // Not needed with React 18 JSX transform
    'no-unused-vars': 'warn', // Change to warning - common in development
    'react/no-unescaped-entities': 'warn', // Change to warning instead of error
    'react-hooks/exhaustive-deps': 'warn', // Change to warning instead of error
  },
};