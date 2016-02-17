describe('SpriteSheet', function() {
  var pInst, _warn;

  beforeEach(function () {
    pInst = new p5(function() {});
    _warn = sinon.stub(p5.prototype, '_warn');
  });

  afterEach(function () {
    _warn.restore();
    pInst.remove();
  });

  it('does not log warning when created with p5 instance', function() {
    new pInst.SpriteSheet(pInst);

    expect(_warn.callCount).to.equal(0);
  });

  it('logs warning when created without p5 instance', function() {
    new pInst.SpriteSheet();

    expect(_warn.callCount).to.equal(1);
    expect(_warn.firstCall.args[0]).to.equal(
      'SpriteSheet() is deprecated; please use ' +
      'p5.prototype.loadSpriteSheet() instead.'
    );
  });
});
