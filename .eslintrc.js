module.exports = {
    
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['react', '@typescript-eslint', 'jest', 'import', 'prettier'],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        'linebreak-style': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        'import/default': 'error',
        'import/no-named-as-default-member': 'error',
        'import/no-named-as-default': 'error',
        '@typescript-eslint/no-unused-vars': ['off'],
        // '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/no-empty-function': ['error'],
        '@typescript-eslint/no-explicit-any': ['off'],
    },
}
