describe('Input', function() {
  var myp5;
  var LEFT_ARROW, LEFT;

  beforeEach(function() {
    myp5 = new p5(function() {});
    LEFT_ARROW = myp5.LEFT_ARROW;
    LEFT = myp5.LEFT;
  });

  afterEach(function() {
    myp5.remove();
  });

  function mouseup(which) {
    myp5._setProperty('mouseButton', which);
    myp5._setProperty('mouseIsPressed', false);
  }

  function mousedown(which) {
    myp5._setProperty('mouseButton', which);
    myp5._setProperty('mouseIsPressed', true);
  }

  function keydown(which) {
    myp5._onkeydown({which: which});
  }

  function keyup(which) {
    myp5._onkeyup({which: which});
  }

  function nextFrame() {
    myp5.readPresses();
  }

  it('reports mouseUp() properly', function() {
    mousedown(LEFT);
    nextFrame();

    expect(myp5.mouseUp(LEFT)).to.be.false;

    mouseup(LEFT);
    nextFrame();

    // TODO: Is this actually the expected behavior?
    // See https://github.com/molleindustria/p5.play/issues/43 for details.
    expect(myp5.mouseUp(LEFT)).to.be.false;

    nextFrame();

    expect(myp5.mouseUp(LEFT)).to.be.true;
  });

  it('reports mouseDown() properly', function() {
    mouseup(LEFT);
    nextFrame();

    expect(myp5.mouseDown(LEFT)).to.be.false;

    mousedown(LEFT);
    nextFrame();

    // TODO: Is this actually the expected behavior?
    // See https://github.com/molleindustria/p5.play/issues/43 for details.
    expect(myp5.mouseDown(LEFT)).to.be.false;

    nextFrame();

    expect(myp5.mouseDown(LEFT)).to.be.true;
  });

  it('reports mouseWentDown() properly', function() {
    mouseup(LEFT);
    nextFrame();

    expect(myp5.mouseWentDown(LEFT)).to.be.false;

    mousedown(LEFT);
    nextFrame();

    expect(myp5.mouseWentDown(LEFT)).to.be.true;

    nextFrame();

    expect(myp5.mouseWentDown(LEFT)).to.be.false;
  });

  it('reports mouseWentUp() properly', function() {
    mousedown(LEFT);
    nextFrame();

    expect(myp5.mouseWentUp(LEFT)).to.be.false;

    mouseup(LEFT);
    nextFrame();

    expect(myp5.mouseWentUp(LEFT)).to.be.true;
  });

  it('reports keyDown() properly', function() {
    keyup(LEFT_ARROW);
    nextFrame();

    expect(myp5.keyDown(LEFT_ARROW)).to.be.false;

    keydown(LEFT_ARROW);
    nextFrame();

    // TODO: Is this actually the expected behavior?
    // See https://github.com/molleindustria/p5.play/issues/43 for details.
    expect(myp5.keyDown(LEFT_ARROW)).to.be.false;

    nextFrame();

    expect(myp5.keyDown(LEFT_ARROW)).to.be.true;
  });

  it('reports keyWentDown() properly', function() {
    keyup(LEFT_ARROW);
    nextFrame();

    expect(myp5.keyWentDown(LEFT_ARROW)).to.be.false;

    keydown(LEFT_ARROW);
    nextFrame();

    expect(myp5.keyWentDown(LEFT_ARROW)).to.be.true;

    nextFrame();

    expect(myp5.keyWentDown(LEFT_ARROW)).to.be.false;
  });

  it('reports keyWentUp() properly', function() {
    keydown(LEFT_ARROW);
    nextFrame();

    expect(myp5.keyWentUp(LEFT_ARROW)).to.be.false;

    keyup(LEFT_ARROW);
    nextFrame();

    expect(myp5.keyWentUp(LEFT_ARROW)).to.be.true;
  });
});
