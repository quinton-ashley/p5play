describe('SpriteSheet', function() {
  var pInst;

  beforeEach(function() {
    pInst = new p5(function() {});
  });

  afterEach(function() {
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

  it('can be initialized with two arguments (image, frames)', function() {
    var image = new p5.Image(200, 160, pInst);
    var frames = [
      {name: 0, frame: {x: 0, y: 0, width: 100, height: 80}},
      {name: 1, frame: {x: 100, y: 0, width: 100, height: 80}},
      {name: 2, frame: {x: 0, y: 80, width: 100, height: 80}},
      {name: 3, frame: {x: 100, y: 80, width: 100, height: 80}}
    ];
    var sheet = new pInst.SpriteSheet(image, frames);
    expect(sheet.image).to.equal(image);
    expect(sheet.frames).to.deep.equal(frames);
    expect(sheet.num_frames).to.equal(frames.length);
    // When initialized this way, frames may have different sizes, so these
    // values initialize to zero.
    expect(sheet.frame_width).to.equal(0);
    expect(sheet.frame_height).to.equal(0);
  });

  it('can be initialized with four arguments (image, frame_width, frame_height, num_frames)', function() {
    var image = new p5.Image(200, 160, pInst);
    var frameWidth = 100;
    var frameHeight = 80;
    var numFrames = 4;
    var expectedFrames = [
      {name: 0, frame: {x: 0, y: 0, width: 100, height: 80}},
      {name: 1, frame: {x: 100, y: 0, width: 100, height: 80}},
      {name: 2, frame: {x: 0, y: 80, width: 100, height: 80}},
      {name: 3, frame: {x: 100, y: 80, width: 100, height: 80}}
    ];
    var sheet = new pInst.SpriteSheet(image, frameWidth, frameHeight, numFrames);
    expect(sheet.image).to.equal(image);
    expect(sheet.frames).to.deep.equal(expectedFrames);
    expect(sheet.frame_width).to.equal(frameWidth);
    expect(sheet.frame_height).to.equal(frameHeight);
    expect(sheet.num_frames).to.equal(numFrames);
  });

  describe('drawFrame', function() {
    var srcImage, frameData, sheet;

    beforeEach(function() {
      // Set up a fake spritesheet for all drawFrame tests
      srcImage = new p5.Image(200, 160, pInst);
      frameData = [
        {name: 0, frame: {x: 0, y: 0, width: 100, height: 160}},
        {name: 1, frame: {x: 100, y: 0, width: 100, height: 160}},
        {name: 'happy', frame: {x: 200, y: 0, width: 100, height: 160}}
      ];
      sheet = new pInst.SpriteSheet(srcImage, frameData);

      // We replace p5.image (which blits from the spritesheet to the canvas)
      // with a stub so that we are just testing the drawFrame method.
      sinon.stub(pInst, 'image');
    });

    afterEach(function() {
      pInst.image.restore();
    });

    it('draws the expected frame to the destination coordinates', function() {
      sheet.drawFrame(1, 25, 45, 50, 80);
      expect(pInst.image.calledOnce).to.be.true;
      expect(pInst.image.firstCall.calledWith(
        srcImage,         // source image
        100, 0, 100, 160, // source coordinates
        25, 45, 50, 80    // destination coordinates
      )).to.be.true;

      sheet.drawFrame(0, 25, 45, 50, 80);
      expect(pInst.image.calledTwice).to.be.true;
      expect(pInst.image.secondCall.calledWith(
        srcImage,         // source image
        0, 0, 100, 160,   // source coordinates
        25, 45, 50, 80    // destination coordinates
      )).to.be.true;
    });

    it('can refer to frame by index', function() {
      sheet.drawFrame(2, 25, 45, 50, 80);
      expect(pInst.image.firstCall.calledWith(
        srcImage,         // source image
        200, 0, 100, 160, // source coordinates
        25, 45, 50, 80    // destination coordinates
      )).to.be.true;
    });

    it('can refer to frame by string name', function() {
      sheet.drawFrame('happy', 25, 45, 50, 80);
      expect(pInst.image.firstCall.calledWith(
        srcImage,         // source image
        200, 0, 100, 160, // source coordinates
        25, 45, 50, 80    // destination coordinates
      )).to.be.true;
    });

    it('default destination width and height are source width and height', function() {
      sheet.drawFrame(0, 25, 45);
      expect(pInst.image.firstCall.calledWith(
        srcImage,         // source image
        0, 0, 100, 160,   // source coordinates
        25, 45, 100, 160  // destination coordinates
      )).to.be.true;
    });
  });
});
