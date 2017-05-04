module.exports = {
  "env": {
    "mocha": true
  },
  "globals": {
    "expect": true,
    "p5": true,
    "sinon": true,
    "p5PlayAssertions": true
  },
  "rules": {
    // Eventually move up to root config.
    "brace-style": "error",
    "curly": "error",

    // Eventually move up to root config.
    "indent": ["error", 2],

    // Eventually we want to propagate this setting up to the main config.
    "keyword-spacing": "error",

    // Allow empty functions in tests, because we often want to pass a no-op
    // placeholder when testing.
    // Very frequent: new p5(function () {})
    "no-empty-function": "off",

    // Chai BDD assertions violate this style rule, so disable it in tests
    // e.g. expect(value).to.equal('something')
    "no-unused-expressions": "off",

    // Eventually we want to propagate these four settings up to the main config.
    "space-before-blocks": "error",
    "space-in-parens": "error",
    "space-infix-ops": "error"
  }
};
