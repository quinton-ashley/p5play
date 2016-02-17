describe('Group', function() {
  var pInst;

  beforeEach(function() {
    pInst = new p5(function() {});
  });

  afterEach(function() {
    pInst.remove();
  });

  describe("removeSprites()", function() {
    it("should remove all sprites", function() {
      var group = new pInst.Group();

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
