// Test utilities available in all test files.  Expects chai, p5, and p5.play
// to be in scope.
var p5PlayAssertions = {
  /**
   * Assert two 2D p5.Vector objects are (nearly) the same - have the same X and
   * Y components to a certain level of precision.  Generate a useful failure
   * message if they do not.
   * @param {p5.Vector} vA
   * @param {p5.Vector} vB
   * @param {number} [precision] - if omitted, use 0.00001.
   */
  expectVectorsAreClose: function expectVectorsAreClose(vA, vB, precision) {
    precision = precision || 0.00001;
    var failMsg = 'Expected <' + vA.x + ', ' + vA.y + '> to be close to <' +
      vB.x + ', ' + vB.y + '>';
    expect(vA.x).to.be.closeTo(vB.x, precision, failMsg);
    expect(vA.y).to.be.closeTo(vB.y, precision, failMsg);
  }
};
