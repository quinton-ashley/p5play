module.exports = {
  "env": {
    "mocha": true
  },
  "globals": {
    "expect": true,
    "p5": true
  },
  "rules": {
    // Allow empty functions in tests, because we often want to pass a no-op
    // placeholder when testing.
    // Very frequent: new p5(function () {})
    "no-empty-function": "off",

    // Chai BDD assertions violate this style rule, so disable it in tests
    // e.g. expect(value).to.equal('something')
    "no-unused-expressions": "off"
  }
};
