describe('SpriteSheet', function() {
  var pInst;

  beforeEach(function () {
    pInst = new p5(function() {});
  });

  afterEach(function () {
    pInst.remove();
  });

  it('can be instantiated via constructor', function() {
    var sheet = new pInst.SpriteSheet();

    expect(sheet).to.be.an.instanceOf(pInst.SpriteSheet);
  });

  it('can be instantiated via loadSpriteSheet()', function() {
    var sheet = pInst.loadSpriteSheet();

    expect(sheet).to.be.an.instanceOf(pInst.SpriteSheet);
  });
});
