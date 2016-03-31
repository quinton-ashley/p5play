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
});
