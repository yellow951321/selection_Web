module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'commonjs': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2017,
    'sourceType': 'module',
  },
  'globals': {
    'process': 'readonly',
  },
  'rules': {
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'no-multi-spaces': 'error',
    'space-before-function-paren': [
      'error',
      'never',
    ],
    'space-in-parens': [
      'error',
      'never',
    ],
    'computed-property-spacing': [
      'error',
      'never',
    ],
    'comma-spacing': [
      'error',
      {
        'before': false,
        'after': true,
      },
    ],
    'comma-dangle': [
      'error',
      'always',
    ],
    'switch-colon-spacing': [
      'error',
      {
        'after': true,
        'before': false,
      },
    ],
    'no-empty-pattern': ['off', ],
    'no-ex-assign': ['off', ],
  },
}