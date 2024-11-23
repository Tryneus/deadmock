import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginStylisticJs from '@stylistic/eslint-plugin-js';
import pluginStylisticJsx from '@stylistic/eslint-plugin-jsx';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginImport from 'eslint-plugin-import';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ['**/*.{js,mjs,cjs,jsx}']},
  {languageOptions: {globals: globals.browser}},
  {languageOptions: {globals: {'Intl': true}}},
  pluginImport.flatConfigs.recommended,
  pluginReact.configs.flat.recommended,
  pluginJs.configs.recommended,
  pluginStylisticJs.configs['all-flat'],
  pluginStylisticJsx.configs['all-flat'],
  {plugins: {
    'react-hooks': pluginReactHooks,
  }},
  {languageOptions: {ecmaVersion: 'latest'}},


  // adapted from https://github.com/preactjs/eslint-config-preact
  {
    settings: {
      // Preact CLI provides these defaults
      targets: ['last 2 versions'],
      polyfills: ['fetch', 'Promise'],
      react: {
        // eslint-plugin-preact interprets this as 'h.createElement',
        // however we only care about marking h() as being a used variable.
        pragma: 'h',
        // We use 'react 16.0' to avoid pushing folks to UNSAFE_ methods.
        version: '16.0'
      }
    },

    rules: {
      /**
       * Preact / JSX rules
       */
      'react/no-deprecated': 'error',
      'react/react-in-jsx-scope': 'off', // handled this automatically
      'react/display-name': ['warn', { ignoreTranspilerName: false }],
      'react/jsx-no-bind': ['warn', {
        ignoreRefs: true,
        allowFunctions: true,
        allowArrowFunctions: true
      }],
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
      'react/jsx-uses-react': 'error', // debatable
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/self-closing-comp': 'error',
      'react/prefer-es6-class': 'error',
      'react/prefer-stateless-function': 'warn',
      'react/require-render-return': 'error',
      'react/no-danger': 'warn',
      // Legacy APIs not supported in Preact:
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-string-refs': 'error',

      /**
       * Hooks
       */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': ['warn', {
        'additionalHooks': 'useAction',
      }],

      /**
       * import rules
       */
      'import/no-unresolved': 'off', // TODO: fix resolver
      'import/exports-last': 'warn',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/order': ['warn', {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        named: true,
        alphabetize: {order: 'asc'},
      }],

      /**
       * General JavaScript error avoidance
       */
      'constructor-super': 'error',
      'no-caller': 'error',
      'no-const-assign': 'error',
      'no-console': ['error', {allow: ['warn', 'error']}],
      'no-delete-var': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': 'warn',
      'no-empty-pattern': 'off',
      'no-empty': 'off',
      'no-extra-parens': 'off',
      'no-iterator': 'error',
      'no-lonely-if': 'error',
      'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
      'no-multi-str': 'warn',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-shadow-restricted-names': 'error',
      'no-shadow': 'warn',
      'no-spaced-func': 'error',
      'no-this-before-super': 'error',
      'no-undef-init': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-vars': ['error', {
        args: 'after-used',
        ignoreRestSiblings: true
      }],
      'no-useless-call': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-constructor': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-rename': 'warn',
      'no-var': 'warn',
      'no-with': 'error',

      /**
       * General JavaScript stylistic rules (disabled)
       */
      'semi': 'warn',
      'strict': ['error', 'never'], // assume type=module output (cli default)
      'object-curly-spacing': ['off', 'always'],
      'rest-spread-spacing': 'off',
      'space-before-function-paren': ['off', 'always'],
      'space-in-parens': ['off', 'never'],
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-rest-params': 'warn',
      'prefer-spread': 'warn',
      'prefer-template': 'warn',
      'radix': 'warn', // parseInt(x, 10)
      'unicode-bom': 'error',
      'valid-jsdoc': 'off',

      /**
       * @stylistic rules
       */
      '@stylistic/js/quotes': ['warn', 'single', {
        allowTemplateLiterals: true
      }],
      '@stylistic/js/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/key-spacing': ['error', {align: 'value', mode: 'minimum'}],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/operator-linebreak': ['error', 'after'],
      '@stylistic/js/padded-blocks': ['error', 'never'],
      '@stylistic/js/no-extra-parens': ['error', 'all', {ignoreJSX: 'multi-line', enforceForArrowConditionals: false}],
      '@stylistic/js/space-before-function-paren': ['error', 'never'],
      '@stylistic/js/object-property-newline': ['error', {allowAllPropertiesOnSameLine: true}],
      '@stylistic/js/array-element-newline': ['error', 'consistent'],
      '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/js/multiline-comment-style': ['error', 'separate-lines'],
      '@stylistic/js/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/js/lines-between-class-members': ['error', 'always', {exceptAfterSingleLine: true}],

      '@stylistic/jsx/jsx-indent': ['error', 2],
      '@stylistic/jsx/jsx-indent-props': ['error', 2],
      '@stylistic/jsx/jsx-max-props-per-line': 'off',
      '@stylistic/jsx/jsx-newline': 'off',
      '@stylistic/jsx/jsx-one-expression-per-line': ['error', {allow: 'single-child'}],
    },
  },
];