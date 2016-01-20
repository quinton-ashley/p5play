describe('Group', function() {
  describe("removeSprites()", function() {
    it("should remove all sprites", function() {
      var group = new Group();

      expect(group.size()).to.equal(0);
      expect(allSprites.size()).to.equal(0);

      group.add(createSprite(1, 1));
      group.add(createSprite(2, 2));

      expect(group.size()).to.equal(2);
      expect(allSprites.size()).to.equal(2);

      group.removeSprites();

      expect(group.size()).to.equal(0);
      expect(allSprites.size()).to.equal(0);
    });
  });
});
