import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
    // Legacy ignorePatterns: .eslintrc.js is gone, createChart.ts/__test__/script.js stay ignored
    { ignores: ['src/createChart.ts', '__test__/**', 'script.js', 'dist/**'] },
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: { ...globals.node, ...globals.jest },
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    prettierRecommended,
    {
        rules: {
            // Legacy 'off' overrides, kept for parity with the pre-migration config.
            // @typescript-eslint/interface-name-prefix was dropped: the rule was
            // removed from typescript-eslint long before v8 and would fail config load.
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
