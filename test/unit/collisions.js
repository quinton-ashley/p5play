describe('collisions', function() {
  const SIZE = 10;
  const HERE = 0;
  const THERE = SIZE * 2;
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
      spriteA = pInst.createSprite(HERE, 0, SIZE, SIZE);
      spriteB = pInst.createSprite(HERE, 0, SIZE, SIZE);

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
        spriteB.position.x = THERE;
        expect(spriteA.overlap(spriteB)).to.be.false;
        expect(spriteB.overlap(spriteA)).to.be.false;
      });

      it('sprites overlap when edges just touch', function () {
        spriteB.position.x = SIZE;
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
        spriteB.position.x = THERE;
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
    var spriteA, spriteB, spriteC;
    var groupA;

    beforeEach(function () {
      spriteA = pInst.createSprite(HERE, 0, SIZE, SIZE);
      spriteB = pInst.createSprite(HERE, 0, SIZE, SIZE);
      spriteC = pInst.createSprite(HERE, 0, SIZE, SIZE);

      groupA = new pInst.Group();
      groupA.add(spriteB);
      groupA.add(spriteC);
    });

    describe('overlap', function () {
      it('returns true if sprite overlaps every sprite in group', function () {
        expect(spriteA.overlap(groupA)).to.be.true;
      });

      it('returns true if sprite overlaps first sprite in group', function () {
        spriteC.position.x = THERE;
        expect(spriteA.overlap(groupA)).to.be.true;
      });

      it('returns true if sprite overlaps last sprite in group', function () {
        spriteB.position.x = THERE;
        expect(spriteA.overlap(groupA)).to.be.true;
      });

      it('returns false if sprite does not overlap any sprites in group', function () {
        spriteB.position.x = THERE;
        spriteC.position.x = THERE;
        expect(spriteA.overlap(groupA)).to.be.false;
      });

      it('sprite in group can overlap with other sprites in group', function () {
        expect(spriteB.overlap(groupA)).to.be.true;
      });

      it('sprite in group does not overlap self', function () {
        spriteC.position.x = THERE;
        expect(spriteB.overlap(groupA)).to.be.false;
      });

      it('calls callback once for each overlapping sprite', function () {
        expect(countingCallback.callCount).to.equal(0);
        spriteA.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(2);

        countingCallback.callCount = 0;
        spriteB.position.x = THERE;
        spriteA.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(1);

        countingCallback.callCount = 0;
        spriteC.position.x = THERE;
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
        spriteB.position.x = HERE;
        spriteC.position.x = THERE;
        spriteA.overlap(groupA, recordPairs);
        expect(pairs).to.deep.equal([[spriteA.name, spriteB.name]]);

        // Overlaps spriteC
        pairs = [];
        spriteB.position.x = THERE;
        spriteC.position.x = HERE;
        spriteA.overlap(groupA, recordPairs);
        expect(pairs).to.deep.equal([[spriteA.name, spriteC.name]]);

        // Overlaps none
        pairs = [];
        spriteB.position.x = THERE;
        spriteC.position.x = THERE;
        spriteA.overlap(groupA, recordPairs);
        expect(pairs).to.deep.equal([]);
      });
    });
  });

  describe('group-group', function () {
    var spriteA, spriteB, spriteC, spriteD;
    var groupA, groupB;

    beforeEach(function () {
      spriteA = pInst.createSprite(HERE, 0, SIZE, SIZE);
      spriteB = pInst.createSprite(HERE, 0, SIZE, SIZE);
      spriteC = pInst.createSprite(HERE, 0, SIZE, SIZE);
      spriteD = pInst.createSprite(HERE, 0, SIZE, SIZE);

      groupA = new pInst.Group();
      groupA.add(spriteA);
      groupA.add(spriteB);

      groupB = new pInst.Group();
      groupB.add(spriteC);
      groupB.add(spriteD);
    });

    describe('overlap', function () {
      it('returns true if all sprites in group A overlap all sprites in group B', function () {
        expect(groupA.overlap(groupB)).to.be.true;
        expect(groupB.overlap(groupA)).to.be.true;
      });

      it('returns true if any sprites in group A overlap any sprites in group B', function () {
        // spriteA overlaps spriteC
        spriteA.position.x = HERE;
        spriteB.position.x = -THERE;
        spriteC.position.x = HERE;
        spriteD.position.x = THERE;
        expect(groupA.overlap(groupB)).to.be.true;
        expect(groupB.overlap(groupA)).to.be.true;

        // spriteA overlaps spriteD
        spriteA.position.x = HERE;
        spriteB.position.x = -THERE;
        spriteC.position.x = THERE;
        spriteD.position.x = HERE;
        expect(groupA.overlap(groupB)).to.be.true;
        expect(groupB.overlap(groupA)).to.be.true;

        // spriteB overlaps spriteC
        spriteA.position.x = -THERE;
        spriteB.position.x = HERE;
        spriteC.position.x = HERE;
        spriteD.position.x = THERE;
        expect(groupA.overlap(groupB)).to.be.true;
        expect(groupB.overlap(groupA)).to.be.true;

        // spriteB overlaps spriteD
        spriteA.position.x = -THERE;
        spriteB.position.x = HERE;
        spriteC.position.x = THERE;
        spriteD.position.x = HERE;
        expect(groupA.overlap(groupB)).to.be.true;
        expect(groupB.overlap(groupA)).to.be.true;
      });

      it('returns false if no sprite in group A overlaps any sprite in group B', function () {
        spriteC.position.x = THERE;
        spriteD.position.x = THERE;
        expect(groupA.overlap(groupB)).to.be.false;
        expect(groupB.overlap(groupA)).to.be.false;
      });

      it('group overlaps self if two different sprites within group overlap', function () {
        expect(groupA.overlap(groupA)).to.be.true;
      });

      it('group does not overlap self if no sprites within group overlap', function () {
        spriteB.position.x = THERE;
        expect(groupA.overlap(groupA)).to.be.false;
      });

      it('calls callback once for each overlapping sprite pair', function () {
        // 2 overlap 2
        expect(countingCallback.callCount).to.equal(0);
        groupA.overlap(groupB, countingCallback);
        expect(countingCallback.callCount).to.equal(4);

        // 2 overlap 2 (inverse)
        countingCallback.callCount = 0;
        groupB.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(4);

        // 1 overlap 2
        countingCallback.callCount = 0;
        spriteB.position.x = -THERE;
        groupA.overlap(groupB, countingCallback);
        expect(countingCallback.callCount).to.equal(2);

        // 2 overlap 1
        countingCallback.callCount = 0;
        groupB.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(2);

        // 1 overlap 1
        countingCallback.callCount = 0;
        spriteC.position.x = THERE;
        groupA.overlap(groupB, countingCallback);
        expect(countingCallback.callCount).to.equal(1);

        countingCallback.callCount = 0;
        spriteC.position.x += 2 * SIZE;
        spriteA.overlap(groupA, countingCallback);
        expect(countingCallback.callCount).to.equal(0);
      });
    });
  });
});
