module.exports = {
  "rules": {
    // As beginner-friendly example code, don't worry about strict equality.
    "eqeqeq": "off",

    // Not enforced globally yet, but useful to keep clean here
    "indent": ["error", 2],

    // Let examples declare variables in the global scope - they aren't actually
    // run in global scope, so it's okay.
    "no-implicit-globals": "off",

    // Don't require variables to be defined before they're used, because these
    // examples run in a context where all p5 members are available globally,
    // and it would be a real pain to call them all out as globals here.
    "no-undef": "off",

    // Likewise, allow unused functions/variables because certain functions like
    // setup() and draw() get called by global-mode p5.play.
    "no-unused-vars": "off"
  }
};
