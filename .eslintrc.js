module.exports = {
  "env": {
    "browser": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "define": true,
    "require": true
  },
  "rules": {
    "accessor-pairs": "error",
    "array-bracket-spacing": [
      "error",
      "never"
    ],
    "array-callback-return": "error",
    "arrow-body-style": "error",
    "arrow-parens": "error",
    "arrow-spacing": "error",
    "block-scoped-var": "error",
    "block-spacing": ["error", "always"],
    "brace-style": "off",
    "callback-return": "error",
    "camelcase": "off",
    "comma-spacing": "error",
    "comma-style": [
      "error",
      "last"
    ],
    "complexity": "off",
    "computed-property-spacing": "error",
    "consistent-return": "off",
    "consistent-this": "off",

    // Use of braces is very inconsistent in the library so far.  It will
    // be a significant change to enable this check.
    "curly": "off",

    "default-case": "error",
    "dot-location": ["error", "property"],
    "dot-notation": "error",
    "eol-last": "error",
    "eqeqeq": "error",
    "func-names": "off",
    "func-style": [
      "error",
      "declaration"
    ],
    "generator-star-spacing": "error",
    "global-require": "off",
    "guard-for-in": "error",
    "handle-callback-err": "error",
    "id-blacklist": "error",
    "id-length": "off",
    "id-match": "error",

    // Enabling indentation checking will be a fairly large operation, as
    // the main library currently ignores its module wrapper for
    // indentation purposes.
    "indent": "off",

    "init-declarations": "off",
    "jsx-quotes": "error",
    "key-spacing": "off",

    // The majority of the library follows (before:true, after:false) for this
    // setting, but there are nearly 100 cases where that fails too, and it's
    // not a great setting for keywords like 'return' and 'throw' so we'll
    // want overrides.
    "keyword-spacing": "off",

    "linebreak-style": [
      "error",
      "unix"
    ],
    "lines-around-comment": "off",
    "max-depth": "off",
    "max-len": "off",
    "max-nested-callbacks": "error",
    "max-params": "off",
    "max-statements": "off",
    "max-statements-per-line": "error",
    "new-parens": "error",
    "newline-after-var": "off",
    "newline-before-return": "off",
    "newline-per-chained-call": "error",
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-catch-shadow": "error",
    "no-cond-assign": [
      "error",
      "except-parens"
    ],
    "no-confusing-arrow": "error",
    "no-console": "off", // Customized: We log certain warnings
    "no-continue": "error",
    "no-div-regex": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "off",
    "no-empty-function": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-extra-parens": "off",
    "no-floating-decimal": "error",
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-inline-comments": "off",
    "no-inner-declarations": [
      "error",
      "functions"
    ],
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-lonely-if": "off",
    "no-loop-func": "error",
    "no-magic-numbers": "off",
    "no-mixed-requires": "error",
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-multiple-empty-lines": "off",
    "no-native-reassign": "error",
    "no-negated-condition": "off",
    "no-nested-ternary": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-require": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "off",
    "no-path-concat": "error",
    "no-plusplus": "off",
    "no-process-env": "error",
    "no-process-exit": "error",
    "no-proto": "error",
    "no-restricted-globals": "error",
    "no-restricted-imports": "error",
    "no-restricted-modules": "error",
    "no-restricted-syntax": "error",
    "no-return-assign": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "off",
    "no-shadow-restricted-names": "error",
    "no-spaced-func": "error",
    "no-sync": "error",
    "no-ternary": "off",
    "no-throw-literal": "off",
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-undefined": "off",
    "no-underscore-dangle": "off",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": "error",
    "no-unused-expressions": "error",
    "no-use-before-define": "off",
    "no-useless-call": "off",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-escape": "error",
    "no-var": "off",
    "no-void": "error",
    "no-warning-comments": "warn",
    "no-whitespace-before-property": "error",
    "no-with": "error",
    "object-curly-spacing": "error",
    "object-shorthand": "off",
    "one-var": "off",
    "one-var-declaration-per-line": "off",
    "operator-assignment": "off",
    "operator-linebreak": "error",
    "padded-blocks": "off",
    "prefer-arrow-callback": "off",
    "prefer-const": "error",
    "prefer-reflect": "off",
    "prefer-rest-params": "off",
    "prefer-spread": "error",
    "prefer-template": "off",
    "quote-props": "off",
    "quotes": ["error", "single"],
    "radix": [
      "error",
      "always"
    ],
    "require-jsdoc": "off",
    "require-yield": "error",
    "semi": ["error", "always"],
    "semi-spacing": "error",
    "sort-imports": "error",
    "sort-vars": "off",

    // I'd like to enable this rule, but should discuss target style
    // with the community before we do because we don't follow it at all
    // right now.
    "space-before-blocks": "off",

    "space-before-function-paren": [
      "error",
      "never"
    ],

    // I'd like to enable these two rules, but should discuss target style
    // with the community before we do because we don't follow these at all
    // right now.
    "space-in-parens": "off",
    "space-infix-ops": "off",

    "space-unary-ops": [
      "error",
      {
        "nonwords": false,
        "words": false
      }
    ],
    "spaced-comment": "off",
    "strict": [
      "error",
      "never"
    ],
    "template-curly-spacing": "error",
    "valid-jsdoc": "off",
    "vars-on-top": "off",
    "wrap-iife": "error",
    "wrap-regex": "error",
    "yield-star-spacing": "error",
    "yoda": "off"
  }
};
