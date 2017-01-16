describe('Animation', function() {
  var pInst;

  beforeEach(function() {
    pInst = new p5(function() {
    });
  });

  afterEach(function() {
    pInst.remove();
  });

  it('gets created properly from a sequence of images', function() {
    // Spritesheet example: 4x2 grid of 10x12 frames
    var animation = pInst.loadAnimation('fakeImage0001.png', 'fakeImage0005.png');
    // These images will fail to load but we can still assert some things about
    // the internal structure of the animation
    expect(animation.images).to.have.length(5);
    animation.images.forEach(function(image) {
      expect(image).to.be.an.instanceOf(p5.Image);
    });
  });

  it('gets created properly from a spritesheet', function() {
    // Spritesheet example: 4x2 grid of 10x12 frames
    var image = new p5.Image(40, 24, pInst);
    var spritesheet = pInst.loadSpriteSheet(image, 10, 12, 8);
    var animation = pInst.loadAnimation(spritesheet);
    expect(animation.spriteSheet).to.equal(spritesheet);
    // Special case for spritesheet: The images array is this nested object,
    // instead of an array of p5.Image like it is in other cases.
    expect(animation.images).to.deep.equal([
      {name: 0, frame: {x: 0, y: 0, width: 10, height: 12}},
      {name: 1, frame: {x: 10, y: 0, width: 10, height: 12}},
      {name: 2, frame: {x: 20, y: 0, width: 10, height: 12}},
      {name: 3, frame: {x: 30, y: 0, width: 10, height: 12}},
      {name: 4, frame: {x: 0, y: 12, width: 10, height: 12}},
      {name: 5, frame: {x: 10, y: 12, width: 10, height: 12}},
      {name: 6, frame: {x: 20, y: 12, width: 10, height: 12}},
      {name: 7, frame: {x: 30, y: 12, width: 10, height: 12}},
    ]);
  });
});
