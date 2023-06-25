module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  parser: 'babel-eslint',
  extends: ['airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'jest'],
  ignorePatterns: ['src/semantic-ui/**'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/forbid-prop-types': [0, { forbid: ['any'] }],
    'react/prop-types': 0,
    'jsx-a11y/media-has-caption': 0,
    'no-underscore-dangle': [
      2,
      { allow: ['_id', '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] },
    ],
    'react/jsx-props-no-spreading': [2, {
      'exceptions': ['input']
    }],
    'no-shadow': [
      2,
      {
        allow: ['clearCurrentGame', 'setClientId', 'fetchGameMultiplayer', 'setCurrentPlayer', 'fetchGamesByClientMultiplayer'],
      },
    ],
    'react-hooks/exhaustive-deps': [
      1
    ],
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true }],
    'no-mixed-operators': [
      'error',
      {
        'allowSamePrecedence': true
      }
    ]
  },
};
