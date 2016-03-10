describe('collisions', function() {
  const SIZE = 10;
  var pInst;
  var countingCallback;

  beforeEach(function () {
    pInst = new p5(function() {});

    // Count callback calls
    countingCallback = function () {
      countingCallback.callCount++;
    };
    countingCallback.callCount = 0;
  });

  afterEach(function () {
    pInst.remove();
  });

  describe('sprite-sprite', function () {
    var spriteA, spriteB;
    var argTrackingCallback;

    beforeEach(function () {
      spriteA = pInst.createSprite(0, 0, SIZE, SIZE);
      spriteB = pInst.createSprite(0, 0, SIZE, SIZE);

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

  describe('sprite-group', function () {
    var spriteA, spriteB, spriteC, spriteD;
    var groupA;
    var argTrackingCallback;

    beforeEach(function () {
      spriteA = pInst.createSprite(0, 0, SIZE, SIZE);
      spriteB = pInst.createSprite(0, 0, SIZE, SIZE);
      spriteC = pInst.createSprite(0, 0, SIZE, SIZE);

      groupA = new pInst.Group();
      groupA.add(spriteB);
      groupA.add(spriteC);

      // Remember last arguments to callback
      argTrackingCallback = function () {
        argTrackingCallback.lastArgs = arguments;
      };
    });

    describe('overlap', function () {
      it('returns true if sprite overlaps every sprite in group', function () {
        expect(spriteA.overlap(groupA)).to.be.true;
      });

      it('returns true if sprite overlaps first sprite in group', function () {
        spriteC.position.x += 2 * SIZE;
        expect(spriteA.overlap(groupA)).to.be.true;
      });

      it('returns true if sprite overlaps last sprite in group', function () {
        spriteB.position.x += 2 * SIZE;
        expect(spriteA.overlap(groupA)).to.be.true;
      });

      it('returns false if sprite does not overlap any sprites in group', function () {
        spriteB.position.x += 2 * SIZE;
        spriteC.position.x += 2 * SIZE;
        expect(spriteA.overlap(groupA)).to.be.false;
      });

      it('sprite in group can overlap with other sprites in group', function () {
        expect(spriteB.overlap(groupA)).to.be.true;
      });

      it('sprite in group does not overlap self', function () {
        spriteC.position.x += 2 * SIZE;
        expect(spriteB.overlap(groupA)).to.be.false;
      });

      it('calls callback once for each overlapping sprite', function () {
        expect(countingCallback.callCount).to.equal(0);
        spriteA.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(2);

        countingCallback.callCount = 0;
        spriteB.position.x += 2 * SIZE;
        spriteA.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(1);

        countingCallback.callCount = 0;
        spriteC.position.x += 2 * SIZE;
        spriteA.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(0);
      });

      it('passes collider and collidee to callback', function () {
        spriteA.name = 'spriteA';
        spriteB.name = 'spriteB';
        spriteC.name = 'spriteC';

        var pairs;
        function recordPairs(a, b) {
          pairs.push([a.name, b.name]);
        }

        // Overlaps both
        pairs = [];
        spriteA.overlap(groupA, recordPairs);
        expect(pairs).to.deep.equal([[spriteA.name, spriteB.name], [spriteA.name, spriteC.name]]);

        // Overlaps spriteB
        pairs = [];
        spriteB.position.x = spriteA.position.x;
        spriteC.position.x = 2 * SIZE;
        spriteA.overlap(groupA, recordPairs);
        expect(pairs).to.deep.equal([[spriteA.name, spriteB.name]]);

        // Overlaps spriteC
        pairs = [];
        spriteB.position.x = 2 * SIZE;
        spriteC.position.x = spriteA.position.x;
        spriteA.overlap(groupA, recordPairs);
        expect(pairs).to.deep.equal([[spriteA.name, spriteC.name]]);

        // Overlaps none
        pairs = [];
        spriteB.position.x = 2 * SIZE;
        spriteC.position.x = 2 * SIZE;
        spriteA.overlap(groupA, recordPairs);
        expect(pairs).to.deep.equal([]);
      });
    });
  });
});
