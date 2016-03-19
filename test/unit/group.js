describe('Group', function() {
  var pInst, group;

  beforeEach(function() {
    pInst = new p5(function() {});
    group = new pInst.Group();
  });

  afterEach(function() {
    pInst.remove();
  });

  it("is an array", function () {
    expect(Array.isArray(group)).to.be.true;
  });

  describe("add()", function () {
    it("adds a sprite to the group", function () {
      var sprite = pInst.createSprite();
      group.add(sprite);
      expect(group).to.include(sprite);
      expect(group[0]).to.equal(sprite);
      expect(group.contains(sprite)).to.be.true;
    });

    it("lets you add different sprites to the group", function () {
      var sprite1 = pInst.createSprite();
      var sprite2 = pInst.createSprite();
      group.add(sprite1);
      group.add(sprite2);
      expect(group.length).to.equal(2);
    });

    it("ignores double addition of a unique sprite", function () {
      var sprite = pInst.createSprite();
      group.add(sprite);
      group.add(sprite);
      expect(group.length).to.equal(1);
      expect(group[0]).to.equal(sprite);
      expect(group[1]).to.be.undefined;
    });
  });

  describe("remove()", function () {
    it("removes a sprite from the group", function () {
      var sprite1 = pInst.createSprite();
      var sprite2 = pInst.createSprite();
      group.add(sprite1);
      group.add(sprite2);
      expect(group.length).to.equal(2);

      group.remove(sprite1);
      expect(group.length).to.equal(1);
      expect(group.contains(sprite1)).to.be.false;
      expect(group.contains(sprite2)).to.be.true;
    });

    it("throws if passed something besides a sprite", function () {
      [
        null,
        undefined,
        3.14,
        'string',
        [],
        {},
        new Error('error')
      ].forEach(function (item) {
        expect(function () {
          group.remove(item)
        }).throws('Error: you can only remove sprites from a group');
      });
    });
  });

  describe("removeSprites()", function() {
    it("should remove all sprites", function() {
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
