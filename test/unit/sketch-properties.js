describe('p5 sketch instances', function() {
  var pInstA, pInstB;

  beforeEach(function() {
    pInstA = new p5(function() {});
    pInstB = new p5(function() {});
  });

  afterEach(function() {
    pInstA.remove();
    pInstB.remove();
  });

  it('have their own allSprites property', function() {
    expect(pInstA.allSprites.length).to.equal(0);
    expect(pInstB.allSprites.length).to.equal(0);

    expect(pInstA.allSprites).to.not.equal(pInstB.allSprites);

    pInstA.createSprite(1, 1);

    expect(pInstA.allSprites.length).to.equal(1);
    expect(pInstB.allSprites.length).to.equal(0);
  });

  it('have their own spriteUpdate property', function() {
    expect(pInstA.spriteUpdate).to.be.true;
    expect(pInstB.spriteUpdate).to.be.true;

    pInstA.updateSprites(false);

    expect(pInstA.spriteUpdate).to.be.false;
    expect(pInstB.spriteUpdate).to.be.true;
  });
});
