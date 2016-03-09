describe('collisions', function() {
  var pInst;

  beforeEach(function () {
    pInst = new p5(function() {});
  });

  afterEach(function () {
    pInst.remove();
  });

  describe('sprite-sprite', function () {
    const SIZE = 10;
    var spriteA, spriteB;
    var countingCallback;
    var argTrackingCallback;

    beforeEach(function () {
      spriteA = pInst.createSprite(0, 0, SIZE, SIZE);
      spriteB = pInst.createSprite(0, 0, SIZE, SIZE);

      // Count callback calls
      countingCallback = function () {
        countingCallback.callCount++;
      };
      countingCallback.callCount = 0;

      // Remember last arguments to callback
      argTrackingCallback = function () {
        argTrackingCallback.lastArgs = arguments;
      };
    });

    describe('overlap', function () {
      it('returns true if sprites overlap', function () {
        expect(spriteA.overlap(spriteB)).to.be.true;
        expect(spriteB.overlap(spriteA)).to.be.true;
      });

      it('returns false if sprites do not overlap', function () {
        spriteB.position.x += 2 * SIZE;
        expect(spriteA.overlap(spriteB)).to.be.false;
        expect(spriteB.overlap(spriteA)).to.be.false;
      });

      it('sprites overlap when edges just touch', function () {
        spriteB.position.x += SIZE;
        expect(spriteA.overlap(spriteB)).to.be.true;
        expect(spriteB.overlap(spriteA)).to.be.true;

        spriteB.position.x += 0.0001;
        expect(spriteA.overlap(spriteB)).to.be.false;
        expect(spriteB.overlap(spriteA)).to.be.false;
      });

      it('calls callback once if sprites overlap', function () {
        expect(countingCallback.callCount).to.equal(0);
        spriteA.overlap(spriteB, countingCallback);
        expect(countingCallback.callCount).to.equal(1);
        spriteB.overlap(spriteA, countingCallback);
        expect(countingCallback.callCount).to.equal(2);
      });

      it('does not call callback if sprites do not overlap', function () {
        spriteB.position.x += 2 * SIZE;
        expect(countingCallback.callCount).to.equal(0);
        spriteA.overlap(spriteB, countingCallback);
        expect(countingCallback.callCount).to.equal(0);
        spriteB.overlap(spriteA, countingCallback);
        expect(countingCallback.callCount).to.equal(0);
      });

      it('passes collider and collidee to callback', function () {
        spriteA.overlap(spriteB, argTrackingCallback);
        expect(argTrackingCallback.lastArgs).to.be.arguments;
        expect(argTrackingCallback.lastArgs.length).to.be.at.least(2);
        expect(argTrackingCallback.lastArgs[0]).to.equal(spriteA);
        expect(argTrackingCallback.lastArgs[1]).to.equal(spriteB);

        spriteB.overlap(spriteA, argTrackingCallback);
        expect(argTrackingCallback.lastArgs).to.be.arguments;
        expect(argTrackingCallback.lastArgs.length).to.be.at.least(2);
        expect(argTrackingCallback.lastArgs[0]).to.equal(spriteB);
        expect(argTrackingCallback.lastArgs[1]).to.equal(spriteA);
      });
    });
  });
});
