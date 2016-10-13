/** @file Tests for Sprite.collide(sprite) behavior.
 *
 * There are four 'collision' methods in p5.play:
 * - overlap (a check with no automatic response)
 * - displace (the caller pushes the callee out of the way)
 * - collide (the callee resists the caller, opposite of displace)
 * - bounce (motion of both callee and caller are affected)
 *
 * They can each be called on sprites and groups.  This file specifically
 * tests the behavior of the collide() method between two sprites.
 */
describe('sprite.collide(sprite)', function() {
  var SIZE = 10;
  var pInst;
  var spriteA, spriteB;
  var callCount, pairs;

  function testCallback(a, b) {
    callCount++;
    pairs.push([a.name, b.name]);
  }

  function moveAToB(a, b) {
    a.position.x = b.position.x;
  }

  beforeEach(function() {
    pInst = new p5(function() {});
    callCount = 0;
    pairs = [];

    function createTestSprite(letter, position) {
      var sprite = pInst.createSprite(position, 0, SIZE, SIZE);
      sprite.name = 'sprite' + letter;
      return sprite;
    }

    spriteA = createTestSprite('A', 2 * SIZE);
    spriteB = createTestSprite('B', 4 * SIZE);

    // Assert initial test state:
    // - Two total sprites
    // - no two sprites overlap
    expect(pInst.allSprites.length).to.equal(2);
    pInst.allSprites.forEach(function(caller) {
      pInst.allSprites.forEach(function(callee) {
        expect(caller.overlap(callee)).to.be.false;
      });
    });
  });

  afterEach(function() {
    pInst.remove();
  });

  it('false if sprites do not overlap', function() {
    expect(spriteA.collide(spriteB)).to.be.false;
    expect(spriteB.collide(spriteA)).to.be.false;
  });

  it('true if sprites overlap', function() {
    moveAToB(spriteA, spriteB);
    expect(spriteA.collide(spriteB)).to.be.true;

    moveAToB(spriteA, spriteB);
    expect(spriteB.collide(spriteA)).to.be.true;
  });

  it('calls callback once if sprites overlap', function() {
    expect(callCount).to.equal(0);

    moveAToB(spriteA, spriteB);
    spriteA.collide(spriteB, testCallback);
    expect(callCount).to.equal(1);

    moveAToB(spriteA, spriteB);
    spriteB.collide(spriteA, testCallback);
    expect(callCount).to.equal(2);
  });

  it('does not call callback if sprites do not overlap', function() {
    expect(callCount).to.equal(0);
    spriteA.collide(spriteB, testCallback);
    expect(callCount).to.equal(0);
    spriteB.collide(spriteA, testCallback);
    expect(callCount).to.equal(0);
  });

  describe('passes collider and collidee to callback', function() {
    it('A-B', function() {
      moveAToB(spriteA, spriteB);
      spriteA.collide(spriteB, testCallback);
      expect(pairs).to.deep.equal([[spriteA.name, spriteB.name]]);
    });

    it('B-A', function() {
      moveAToB(spriteA, spriteB);
      spriteB.collide(spriteA, testCallback);
      expect(pairs).to.deep.equal([[spriteB.name, spriteA.name]]);
    });
  });

  it('does not reposition either sprite when sprites do not overlap', function() {
    var initialPositionA = spriteA.position.copy();
    var initialPositionB = spriteB.position.copy();

    spriteA.collide(spriteB);

    expectVectorsAreClose(spriteA.position, initialPositionA);
    expectVectorsAreClose(spriteB.position, initialPositionB);

    spriteB.collide(spriteA);

    expectVectorsAreClose(spriteA.position, initialPositionA);
    expectVectorsAreClose(spriteB.position, initialPositionB);
  });

  describe('displaces the caller out of collision when sprites do overlap', function() {
    it('to the left', function() {
      spriteA.position.x = spriteB.position.x - 1;

      var expectedPositionA = spriteB.position.copy().add(-SIZE, 0);
      var expectedPositionB = spriteB.position.copy();

      spriteA.collide(spriteB);

      expectVectorsAreClose(spriteA.position, expectedPositionA);
      expectVectorsAreClose(spriteB.position, expectedPositionB);
    });

    it('to the right', function() {
      spriteA.position.x = spriteB.position.x + 1;

      var expectedPositionA = spriteB.position.copy().add(SIZE, 0);
      var expectedPositionB = spriteB.position.copy();

      spriteA.collide(spriteB);

      expectVectorsAreClose(spriteA.position, expectedPositionA);
      expectVectorsAreClose(spriteB.position, expectedPositionB);
    });

    it('caller and callee reversed', function() {
      spriteA.position.x = spriteB.position.x + 1;

      var expectedPositionA = spriteA.position.copy();
      var expectedPositionB = spriteA.position.copy().add(-SIZE, 0);

      spriteB.collide(spriteA);

      expectVectorsAreClose(spriteA.position, expectedPositionA);
      expectVectorsAreClose(spriteB.position, expectedPositionB);
    });
  });

  it('does not change velocity of either sprite when sprites do not overlap', function() {
    var initialVelocityA = spriteA.velocity.copy();
    var initialVelocityB = spriteB.velocity.copy();

    spriteA.collide(spriteB);

    expectVectorsAreClose(spriteA.velocity, initialVelocityA);
    expectVectorsAreClose(spriteB.velocity, initialVelocityB);

    spriteB.collide(spriteA);

    expectVectorsAreClose(spriteA.velocity, initialVelocityA);
    expectVectorsAreClose(spriteB.velocity, initialVelocityB);
  });

  describe('matches caller velocity to callee velocity when sprites do overlap', function() {
    it('when callee velocity is zero', function() {
      spriteA.position.x = spriteB.position.x - 1;
      spriteA.velocity.x = 2;
      spriteB.velocity.x = 0;

      var expectedVelocityA = spriteB.velocity.copy();
      var expectedVelocityB = spriteB.velocity.copy();

      spriteA.collide(spriteB);

      expectVectorsAreClose(spriteA.velocity, expectedVelocityA);
      expectVectorsAreClose(spriteB.velocity, expectedVelocityB);
    });

    it('when callee velocity is nonzero', function() {
      spriteA.position.x = spriteB.position.x - 1;
      spriteA.velocity.x = 2;
      spriteB.velocity.x = -1;

      var expectedVelocityA = spriteB.velocity.copy();
      var expectedVelocityB = spriteB.velocity.copy();

      spriteA.collide(spriteB);

      expectVectorsAreClose(spriteA.velocity, expectedVelocityA);
      expectVectorsAreClose(spriteB.velocity, expectedVelocityB);
    });

    it('only along x axis when only displaced along x axis', function() {
      spriteA.position.x = spriteB.position.x - 1;
      spriteA.velocity.x = 2;
      spriteA.velocity.y = 3;
      spriteB.velocity.x = -1;

      // Expect to change velocity only along X
      var expectedVelocityA = spriteA.velocity.copy();
      expectedVelocityA.x = spriteB.velocity.x;
      var expectedVelocityB = spriteB.velocity.copy();

      spriteA.collide(spriteB);

      expectVectorsAreClose(spriteA.velocity, expectedVelocityA);
      expectVectorsAreClose(spriteB.velocity, expectedVelocityB);
    });

    it('only along y axis when only displaced along y axis', function() {
      spriteA.position.x = spriteB.position.x;
      spriteA.position.y = spriteB.position.y + 1;
      spriteA.velocity.x = 2;
      spriteA.velocity.y = 3;
      spriteB.velocity.x = -1;
      spriteB.velocity.y = 1.5;

      // Expect to change velocity only along Y
      var expectedVelocityA = spriteA.velocity.copy();
      expectedVelocityA.y = spriteB.velocity.y;
      var expectedVelocityB = spriteB.velocity.copy();

      spriteA.collide(spriteB);

      expectVectorsAreClose(spriteA.velocity, expectedVelocityA);
      expectVectorsAreClose(spriteB.velocity, expectedVelocityB);
    });

    it('caller and callee reversed', function() {
      spriteA.position.x = spriteB.position.x - 1;
      spriteA.velocity.x = 2;
      spriteB.velocity.x = -1;

      var expectedVelocityA = spriteA.velocity.copy();
      var expectedVelocityB = spriteA.velocity.copy();

      spriteB.collide(spriteA);

      expectVectorsAreClose(spriteA.velocity, expectedVelocityA);
      expectVectorsAreClose(spriteB.velocity, expectedVelocityB);
    });
  });

  function expectVectorsAreClose(vA, vB) {
    var failMsg = 'Expected <' + vA.x + ', ' + vA.y + '> to equal <' +
      vB.x + ', ' + vB.y + '>';
    expect(vA.x).to.be.closeTo(vB.x, 0.00001, failMsg);
    expect(vA.y).to.be.closeTo(vB.y, 0.00001, failMsg);
  }
});

