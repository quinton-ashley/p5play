describe('Camera', function() {
  var pInst;

  beforeEach(function() {
    pInst = new p5(function() {});
  });

  afterEach(function() {
    pInst.remove();
  });

  // These tests are for testing the fix to:
  // https://github.com/molleindustria/p5.play/issues/107
  //
  // p5.play registers certain methods that atre run pre- and post-draw().
  // So, a draw() cycle goes (basically) like this:
  //
  // (start with the camera inactive)
  // updateSprites()  - calls Sprite.update() on all sprites
  // pushCamera()     - apply camera transforms and mark camera active
  // draw()	      - draw any sprites
  // popCamera()      - unapplies camera transforms and marks camera inactive
  //
  // Mouse events are checked in Sprite.update().
  // So the basic problem was that sprites would /never/ see the camera active, 
  // regardless of whether they were drawn with a camera turned on or not
  describe('mouse events with camera', function() {
    var sprite;

    beforeEach(function() {
      // Create a square sprite centered at (100, 50) with size (100, 100)
      // without camera, should pick up anything from (51, 1) to (149, 59)
      sprite = pInst.createSprite(100, 50, 100, 100);

      // Need to turn the camera on before we can move it
      // (because of finicky initialization reasons)
      pInst.camera.on();

      // Move camera 50 units to the right
      // So now the sprite should pick up mouse events from (-49, 1) to (49, 99)
      pInst.camera.position.x += 50;

      sprite.onMouseOver = sinon.spy();
    });

    function moveMouseTo(x, y) {
      pInst.mouseX = x;
      pInst.mouseY = y;
    }

    // sort of simulates a draw cycle, including calling relevent methods
    // that are registered to run pre- and post-draw()
    function fullDrawCycle() {
      // make sure to begin cycle with camera off
      pInst.camera.off();

      // pre-draw() registered methods
      pInst.camera.on();
      pInst.updateSprites();

      // example of what a user would do in draw()
      pInst.drawSprite(sprite);

      // post-draw() registered methods
      pInst.camera.off();
    }
    
    it('sees the mouse over the sprite (with or without camera)', function() {
      fullDrawCycle(); // first cycle is to draw the sprite with camera
      moveMouseTo(90, 50);
      fullDrawCycle(); // second one is so that Sprite.update() calls the call back
      expect(sprite.mouseIsOver).to.be.true;
    });

    it('sees the mouse to the right of the sprite (with camera)', function() {
      fullDrawCycle();
      moveMouseTo(110, 50)
      fullDrawCycle();
      expect(sprite.mouseIsOver).to.be.false;
    });

    it('sees the mouse over the sprite (with camera)', function() {
      fullDrawCycle();
      moveMouseTo(40, 50)
      fullDrawCycle();
      expect(sprite.mouseIsOver).to.be.true;
    });

    it('calls onMouseOver() callback with camera moved', function() {
      fullDrawCycle();
      moveMouseTo(110, 50)
      fullDrawCycle();
      expect(sprite.onMouseOver.called).to.be.false;

      fullDrawCycle();
      moveMouseTo(40, 50)
      fullDrawCycle();
      expect(sprite.onMouseOver.called).to.be.true;
    });
  });
});
