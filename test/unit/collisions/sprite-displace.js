/** @file Tests for Sprite.displace(sprite) behavior. */
describe('sprite.displace(sprite)', function() {
  var expectVectorsAreClose = p5PlayAssertions.expectVectorsAreClose;
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
    pInst = new p5(function() {
    });
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
    expect(spriteA.displace(spriteB)).to.be.false;
    expect(spriteB.displace(spriteA)).to.be.false;
  });

  it('true if sprites overlap', function() {
    moveAToB(spriteA, spriteB);
    expect(spriteA.displace(spriteB)).to.be.true;

    moveAToB(spriteA, spriteB);
    expect(spriteB.displace(spriteA)).to.be.true;
  });

  it('calls callback once if sprites overlap', function() {
    expect(callCount).to.equal(0);

    moveAToB(spriteA, spriteB);
    spriteA.displace(spriteB, testCallback);
    expect(callCount).to.equal(1);

    moveAToB(spriteA, spriteB);
    spriteB.displace(spriteA, testCallback);
    expect(callCount).to.equal(2);
  });

  it('does not call callback if sprites do not overlap', function() {
    expect(callCount).to.equal(0);
    spriteA.displace(spriteB, testCallback);
    expect(callCount).to.equal(0);
    spriteB.displace(spriteA, testCallback);
    expect(callCount).to.equal(0);
  });

  describe('passes collider and collidee to callback', function() {
    it('A-B', function() {
      moveAToB(spriteA, spriteB);
      spriteA.displace(spriteB, testCallback);
      expect(pairs).to.deep.equal([[spriteA.name, spriteB.name]]);
    });

    it('B-A', function() {
      moveAToB(spriteA, spriteB);
      spriteB.displace(spriteA, testCallback);
      expect(pairs).to.deep.equal([[spriteB.name, spriteA.name]]);
    });
  });

  it('does not reposition either sprite when sprites do not overlap', function() {
    var initialPositionA = spriteA.position.copy();
    var initialPositionB = spriteB.position.copy();

    spriteA.displace(spriteB);

    expectVectorsAreClose(spriteA.position, initialPositionA);
    expectVectorsAreClose(spriteB.position, initialPositionB);

    spriteB.displace(spriteA);

    expectVectorsAreClose(spriteA.position, initialPositionA);
    expectVectorsAreClose(spriteB.position, initialPositionB);
  });

  it('does not reposition either sprite when callee is immovable', function() {
    spriteA.position.x = spriteB.position.x - 1;
    spriteB.immovable = true;

    var initialPositionA = spriteA.position.copy();
    var initialPositionB = spriteB.position.copy();

    spriteA.displace(spriteB);

    expectVectorsAreClose(spriteA.position, initialPositionA);
    expectVectorsAreClose(spriteB.position, initialPositionB);
  });

  describe('displaces the callee out of collision when sprites do overlap', function() {
    it('to the left', function() {
      spriteA.position.x = spriteB.position.x - 1;

      var expectedPositionA = spriteA.position.copy();
      var expectedPositionB = spriteA.position.copy().add(SIZE, 0);

      spriteA.displace(spriteB);

      expectVectorsAreClose(spriteA.position, expectedPositionA);
      expectVectorsAreClose(spriteB.position, expectedPositionB);
    });

    it('to the right', function() {
      spriteA.position.x = spriteB.position.x + 1;

      var expectedPositionA = spriteA.position.copy();
      var expectedPositionB = spriteA.position.copy().add(-SIZE, 0);

      spriteA.displace(spriteB);

      expectVectorsAreClose(spriteA.position, expectedPositionA);
      expectVectorsAreClose(spriteB.position, expectedPositionB);
    });

    it('caller and callee reversed', function() {
      spriteA.position.x = spriteB.position.x + 1;

      var expectedPositionA = spriteB.position.copy().add(SIZE, 0);
      var expectedPositionB = spriteB.position.copy();

      spriteB.displace(spriteA);

      expectVectorsAreClose(spriteA.position, expectedPositionA);
      expectVectorsAreClose(spriteB.position, expectedPositionB);
    });
  });

  it('does not change velocity of either sprite', function() {
    var initialVelocityA = spriteA.velocity.copy();
    var initialVelocityB = spriteB.velocity.copy();

    spriteA.position.x = spriteB.position.x + 1;
    spriteA.displace(spriteB);

    expectVectorsAreClose(spriteA.velocity, initialVelocityA);
    expectVectorsAreClose(spriteB.velocity, initialVelocityB);

    spriteB.displace(spriteA);

    expectVectorsAreClose(spriteA.velocity, initialVelocityA);
    expectVectorsAreClose(spriteB.velocity, initialVelocityB);
  });
});
