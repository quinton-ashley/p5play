/** @file Tests for Sprite.bounce(sprite) behavior */
describe('sprite.bounce(sprite)', function() {
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
    expect(spriteA.bounce(spriteB)).to.be.false;
    expect(spriteB.bounce(spriteA)).to.be.false;
  });

  it('true if sprites overlap', function() {
    moveAToB(spriteA, spriteB);
    expect(spriteA.bounce(spriteB)).to.be.true;

    moveAToB(spriteA, spriteB);
    expect(spriteB.bounce(spriteA)).to.be.true;
  });

  it('calls callback once if sprites overlap', function() {
    expect(callCount).to.equal(0);

    moveAToB(spriteA, spriteB);
    spriteA.bounce(spriteB, testCallback);
    expect(callCount).to.equal(1);

    moveAToB(spriteA, spriteB);
    spriteB.bounce(spriteA, testCallback);
    expect(callCount).to.equal(2);
  });

  it('does not call callback if sprites do not overlap', function() {
    expect(callCount).to.equal(0);
    spriteA.bounce(spriteB, testCallback);
    expect(callCount).to.equal(0);
    spriteB.bounce(spriteA, testCallback);
    expect(callCount).to.equal(0);
  });

  describe('passes collider and collidee to callback', function() {
    it('A-B', function() {
      moveAToB(spriteA, spriteB);
      spriteA.bounce(spriteB, testCallback);
      expect(pairs).to.deep.equal([[spriteA.name, spriteB.name]]);
    });

    it('B-A', function() {
      moveAToB(spriteA, spriteB);
      spriteB.bounce(spriteA, testCallback);
      expect(pairs).to.deep.equal([[spriteB.name, spriteA.name]]);
    });
  });
});
