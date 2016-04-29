describe('Group', function() {
  var pInst, group;

  beforeEach(function() {
    pInst = new p5(function() {});
    group = new pInst.Group();
  });

  afterEach(function() {
    pInst.remove();
  });

  it('is an array', function() {
    expect(Array.isArray(group)).to.be.true;
  });

  describe('add()', function() {
    it('adds a sprite to the group', function() {
      var sprite = pInst.createSprite();
      group.add(sprite);
      expect(group).to.include(sprite);
      expect(group[0]).to.equal(sprite);
      expect(group.contains(sprite)).to.be.true;
    });

    it('gives the sprite a reference to itself', function() {
      var sprite = pInst.createSprite();
      group.add(sprite);
      expect(sprite.groups).to.include(group);
    });

    it('lets you add different sprites to the group', function() {
      var sprite1 = pInst.createSprite();
      var sprite2 = pInst.createSprite();
      group.add(sprite1);
      group.add(sprite2);
      expect(group.length).to.equal(2);
    });

    it('ignores double addition of a unique sprite', function() {
      var sprite = pInst.createSprite();
      group.add(sprite);
      group.add(sprite);
      expect(group.length).to.equal(1);
      expect(group[0]).to.equal(sprite);
      expect(group[1]).to.be.undefined;
    });

    it('throws if passed something besides a sprite', function() {
      [
        null,
        undefined,
        3.14,
        'string',
        [],
        {},
        new Error('error')
      ].forEach(function(item) {
        expect(function() {
          group.add(item);
        }).throws('Error: you can only add sprites to a group');
      });
    });
  });

  describe('remove()', function() {
    it('removes a sprite from the group', function() {
      var sprite1 = pInst.createSprite();
      var sprite2 = pInst.createSprite();
      group.add(sprite1);
      group.add(sprite2);
      expect(group.length).to.equal(2);

      var result = group.remove(sprite1);
      expect(result).to.be.true;
      expect(group.length).to.equal(1);
      expect(group.contains(sprite1)).to.be.false;
      expect(group.contains(sprite2)).to.be.true;
    });

    it('removes the sprite\'s reference to itself', function() {
      var sprite = pInst.createSprite();
      group.add(sprite);
      expect(sprite.groups).to.include(group);
      group.remove(sprite);
      expect(sprite.groups).to.not.include(group);
    });

    it('returns false if the sprite is not a member of the group', function() {
      var sprite1 = pInst.createSprite();
      var sprite2 = pInst.createSprite();
      group.add(sprite1);
      expect(group.length).to.equal(1);

      var result = group.remove(sprite2);
      expect(result).to.be.false;
      expect(group.length).to.equal(1);
    });

    it('removes all copies of a sprite if more than one happen to be present', function() {
      // This shouldn't happen when using a group properly, but just in case let's
      // make sure we clean up properly.
      var sprite = pInst.createSprite();
      group.add(sprite);
      group.push(sprite);
      expect(group.length).to.equal(2);
      expect(group[0]).to.equal(sprite);
      expect(group[1]).to.equal(sprite);

      group.remove(sprite);
      expect(group.length).to.equal(0);
    });

    it('throws if passed something besides a sprite', function() {
      [
        null,
        undefined,
        3.14,
        'string',
        [],
        {},
        new Error('error')
      ].forEach(function(item) {
        expect(function() {
          group.remove(item);
        }).throws('Error: you can only remove sprites from a group');
      });
    });
  });

  describe('removeSprites()', function() {
    it('should remove all sprites', function() {
      expect(group.size()).to.equal(0);
      expect(pInst.allSprites.size()).to.equal(0);

      group.add(pInst.createSprite(1, 1));
      group.add(pInst.createSprite(2, 2));

      expect(group.size()).to.equal(2);
      expect(pInst.allSprites.size()).to.equal(2);

      group.removeSprites();

      expect(group.size()).to.equal(0);
      expect(pInst.allSprites.size()).to.equal(0);
    });
  });

  describe('maxDepth()', function() {
    it('should be zero for an empty group', function() {
      expect(group.maxDepth()).to.equal(0);
    });

    it('should be the depth of the sprite in a single-sprite group', function() {
      var sprite = pInst.createSprite(1, 1);
      sprite.depth = 99;
      group.add(sprite);
      expect(group.maxDepth()).to.equal(sprite.depth);
    });

    it('even when the max sprite depth is negative', function() {
      var sprite = pInst.createSprite(1, 1);
      sprite.depth = -99;
      group.add(sprite);
      expect(group.maxDepth()).to.equal(sprite.depth);
    });

    it('should be the greatest depth of sprites in the group', function() {
      var topSprite = pInst.createSprite(1, 1);
      var sprite2 = pInst.createSprite(1, 2);
      var sprite3 = pInst.createSprite(1, 3);

      topSprite.depth = 100;
      sprite2.depth = 15;
      sprite3.depth = -101;
      expect(pInst.allSprites.maxDepth()).to.equal(topSprite.depth);

      // Regardless of order they are added
      group.add(sprite3);
      group.add(topSprite);
      group.add(sprite2);
      expect(group.maxDepth()).to.equal(topSprite.depth);
    });

    it('only considers sprites in the given group', function() {
      var topSprite = pInst.createSprite(1, 1);
      var sprite2 = pInst.createSprite(1, 2);
      var sprite3 = pInst.createSprite(1, 3);

      topSprite.depth = 100;
      sprite2.depth = 15;
      sprite3.depth = -101;

      group.add(sprite3);
      group.add(sprite2);
      expect(group.maxDepth()).to.equal(sprite2.depth);
    });

    it('works given negative depths too', function() {
      var topSprite = pInst.createSprite(1, 1);
      var sprite2 = pInst.createSprite(1, 2);
      var sprite3 = pInst.createSprite(1, 3);

      topSprite.depth = -12;
      sprite2.depth = -15;
      sprite3.depth = -101;

      group.add(topSprite);
      group.add(sprite2);
      group.add(sprite3);
      expect(group.maxDepth()).to.equal(topSprite.depth);
    });
  });

  describe('minDepth()', function() {
    it('should be 99999 for an empty group', function() {
      expect(group.minDepth()).to.equal(99999);
    });

    it('should be the depth of the sprite in a single-sprite group', function() {
      var sprite = pInst.createSprite(1, 1);
      sprite.depth = 99;
      group.add(sprite);
      expect(group.minDepth()).to.equal(sprite.depth);
    });

    it('even when the max sprite depth is greater than 99999', function() {
      var sprite = pInst.createSprite(1, 1);
      sprite.depth = Number.MAX_VALUE;
      expect(sprite.depth).to.be.greaterThan(99999);
      group.add(sprite);
      expect(group.minDepth()).to.equal(sprite.depth);
    });

    it('should be the greatest depth of sprites in the group', function() {
      var bottomSprite = pInst.createSprite(1, 1);
      var sprite2 = pInst.createSprite(1, 2);
      var sprite3 = pInst.createSprite(1, 3);

      bottomSprite.depth = 1;
      sprite2.depth = 15;
      sprite3.depth = 101;
      expect(pInst.allSprites.minDepth()).to.equal(bottomSprite.depth);

      // Regardless of order they are added
      group.add(sprite3);
      group.add(bottomSprite);
      group.add(sprite2);
      expect(group.minDepth()).to.equal(bottomSprite.depth);
    });

    it('only considers sprites in the given group', function() {
      var bottomSprite = pInst.createSprite(1, 1);
      var sprite2 = pInst.createSprite(1, 2);
      var sprite3 = pInst.createSprite(1, 3);

      bottomSprite.depth = 1;
      sprite2.depth = 15;
      sprite3.depth = 101;

      group.add(sprite3);
      group.add(sprite2);
      expect(group.minDepth()).to.equal(sprite2.depth);
    });

    it('works given negative depths too', function() {
      var bottomSprite = pInst.createSprite(1, 1);
      var sprite2 = pInst.createSprite(1, 2);
      var sprite3 = pInst.createSprite(1, 3);

      bottomSprite.depth = -100;
      sprite2.depth = -15;
      sprite3.depth = -50;

      group.add(bottomSprite);
      group.add(sprite2);
      group.add(sprite3);
      expect(group.minDepth()).to.equal(bottomSprite.depth);
    });
  });
});
