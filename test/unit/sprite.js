describe('Sprite', function() {
  var pInst;

  beforeEach(function() {
    pInst = new p5(function() {});
  });

  afterEach(function() {
    pInst.remove();
  });

  it('sets correct coordinate mode for rendering', function() {
    // Note: This test reaches into p5's internals somewhat more than usual.
    // It's designed to catch a particular rendering regression reported in
    // issue #48, where certain local constants are initialized incorrectly.
    // See https://github.com/molleindustria/p5.play/issues/48
    expect(p5.prototype.CENTER).to.not.be.undefined;
    var rectMode, ellipseMode, imageMode;

    // Monkeypatch sprite's draw method to inspect coordinate mode at draw-time.
    var sprite = pInst.createSprite();
    sprite.draw = function() {
      rectMode = pInst._renderer._rectMode;
      ellipseMode = pInst._renderer._ellipseMode;
      imageMode = pInst._renderer._imageMode;
    };
    pInst.drawSprites();

    // Check captured modes.
    expect(rectMode).to.equal(p5.prototype.CENTER);
    expect(ellipseMode).to.equal(p5.prototype.CENTER);
    expect(imageMode).to.equal(p5.prototype.CENTER);
  });

  describe('getDirection', function() {
    var sprite;

    beforeEach(function() {
      sprite = pInst.createSprite();
    });

    function checkDirectionForVelocity(v, d) {
      sprite.velocity.x = v[0];
      sprite.velocity.y = v[1];
      expect(sprite.getDirection()).to.equal(d);
    }

    it('returns zero when there is no velocity', function() {
      checkDirectionForVelocity([0, 0], 0);
    });

    it('positive or zero y velocity gives a positive direction', function() {
      checkDirectionForVelocity([-1, 0], 180);
      checkDirectionForVelocity([0, 0], 0);
      checkDirectionForVelocity([1, 0], 0);

      checkDirectionForVelocity([-1, 1], 135);
      checkDirectionForVelocity([0, 1], 90);
      checkDirectionForVelocity([1, 1], 45);
    });

    it('negative y velocity gives a negative direction', function() {
      checkDirectionForVelocity([-1, -1], -135);
      checkDirectionForVelocity([0, -1], -90);
      checkDirectionForVelocity([1, -1], -45);
    });

    it('returns degrees when p5 angleMode is RADIANS', function() {
      pInst.angleMode(p5.prototype.RADIANS);
      checkDirectionForVelocity([1, 1], 45);
      checkDirectionForVelocity([0, 1], 90);
    });

    it('returns degrees when p5 angleMode is DEGREES', function() {
      pInst.angleMode(p5.prototype.DEGREES);
      checkDirectionForVelocity([1, 1], 45);
      checkDirectionForVelocity([0, 1], 90);
    });

  });

  describe('dimension updating when animation changes', function() {
    it('animation width and height get inherited from frame', function() {
      var image = new p5.Image(100, 100, pInst);
      var frames = [
        {name: 0, frame: {x: 0, y: 0, width: 30, height: 30}}
      ];
      var sheet = new pInst.SpriteSheet(image, frames);
      var animation = new pInst.Animation(sheet);

      var sprite = pInst.createSprite(0, 0);
      sprite.addAnimation('label', animation);

      expect(sprite.width).to.equal(30);
      expect(sprite.height).to.equal(30);
    });

    it('updates the width and height property when frames are different sizes', function() {
      var image = new p5.Image(100, 100, pInst);
      var frames = [
        {name: 0, frame: {x: 0, y: 0, width: 50, height: 50}},
        {name: 1, frame: {x: 100, y: 0, width: 40, height: 60}},
        {name: 2, frame: {x: 0, y: 80, width: 70, height: 30}}
      ];
      var sheet = new pInst.SpriteSheet(image, frames);
      var animation = new pInst.Animation(sheet);

      var sprite = pInst.createSprite(0, 0);
      sprite.addAnimation('label', animation);

      expect(sprite.width).to.equal(50);
      expect(sprite.height).to.equal(50);

      // Frame changes after every 4th update because of frame delay.
      sprite.update();
      sprite.update();
      sprite.update();
      sprite.update();
      expect(sprite.width).to.equal(40);
      expect(sprite.height).to.equal(60);

      sprite.update();
      sprite.update();
      sprite.update();
      sprite.update();
      expect(sprite.width).to.equal(70);
      expect(sprite.height).to.equal(30);
    });
  });

  describe('mouse events', function() {
    var sprite;

    beforeEach(function() {
      // Create a sprite with centered at 50,50 with size 100,100.
      // Its default collider picks up anything from 1,1 to 99,99.
      sprite = pInst.createSprite(50, 50, 100, 100);
      sprite.onMouseOver = sinon.spy();
      sprite.onMouseOut = sinon.spy();
      sprite.onMousePressed = sinon.spy();
      sprite.onMouseReleased = sinon.spy();
    });

    function moveMouseTo(x, y) {
      pInst.mouseX = x;
      pInst.mouseY = y;
      sprite.update();
    }

    function moveMouseOver() {
      moveMouseTo(1, 1);
    }

    function moveMouseOut() {
      moveMouseTo(0, 0);
    }

    function pressMouse() {
      pInst.mouseIsPressed = true;
      sprite.update();
    }

    function releaseMouse() {
      pInst.mouseIsPressed = false;
      sprite.update();
    }

    it('mouseIsOver property represents whether mouse is over collider', function() {
      moveMouseTo(0, 0);
      expect(sprite.mouseIsOver).to.be.false;
      moveMouseTo(1, 1);
      expect(sprite.mouseIsOver).to.be.true;
      moveMouseTo(99, 99);
      expect(sprite.mouseIsOver).to.be.true;
      moveMouseTo(100, 100);
      expect(sprite.mouseIsOver).to.be.false;
    });

    describe('onMouseOver callback', function() {
      it('calls onMouseOver when the mouse enters the sprite collider', function() {
        moveMouseOut();
        expect(sprite.onMouseOver.called).to.be.false;
        moveMouseOver();
        expect(sprite.onMouseOver.called).to.be.true;
      });

      it('does not call onMouseOver when the mouse moves within the sprite collider', function() {
        moveMouseTo(0, 0);
        expect(sprite.onMouseOver.callCount).to.equal(0);
        moveMouseTo(1, 1);
        expect(sprite.onMouseOver.callCount).to.equal(1);
        moveMouseTo(2, 2);
        expect(sprite.onMouseOver.callCount).to.equal(1);
      });

      it('calls onMouseOver again when the mouse leaves and returns', function() {
        moveMouseOut();
        expect(sprite.onMouseOver.callCount).to.equal(0);
        moveMouseOver();
        expect(sprite.onMouseOver.callCount).to.equal(1);
        moveMouseOut();
        expect(sprite.onMouseOver.callCount).to.equal(1);
        moveMouseOver();
        expect(sprite.onMouseOver.callCount).to.equal(2);
      });
    });

    describe('onMouseOut callback', function() {
      it('calls onMouseOut when the mouse leaves the sprite collider', function() {
        moveMouseOver();
        expect(sprite.onMouseOut.called).to.be.false;
        moveMouseOut();
        expect(sprite.onMouseOut.called).to.be.true;
      });

      it('does not call onMouseOut when the mouse moves outside the sprite collider', function() {
        moveMouseTo(0, 0);
        expect(sprite.onMouseOut.called).to.be.false;
        moveMouseTo(0, 1);
        expect(sprite.onMouseOut.called).to.be.false;
      });

      it('calls onMouseOut again when the mouse returns and leaves', function() {
        moveMouseOver();
        expect(sprite.onMouseOut.callCount).to.equal(0);
        moveMouseOut();
        expect(sprite.onMouseOut.callCount).to.equal(1);
        moveMouseOver();
        expect(sprite.onMouseOut.callCount).to.equal(1);
        moveMouseOut();
        expect(sprite.onMouseOut.callCount).to.equal(2);
      });
    });

    describe('onMousePressed callback', function() {
      it('does not call onMousePressed if the mouse was not over the sprite', function() {
        expect(sprite.mouseIsOver).to.be.false;
        pressMouse();
        expect(sprite.onMousePressed.called).to.be.false;
      });

      it('calls onMousePressed if the mouse was pressed over the sprite', function() {
        moveMouseOver();
        pressMouse();
        expect(sprite.onMousePressed.called).to.be.true;
      });

      it('calls onMousePressed if the mouse was pressed outside the sprite then dragged over it', function() {
        pressMouse();
        moveMouseOver();
        expect(sprite.onMousePressed.called).to.be.true;
      });
    });

    describe('onMouseReleased callback', function() {
      it('does not call onMouseReleased if the mouse was never pressed over the sprite', function() {
        expect(sprite.mouseIsOver).to.be.false;
        pressMouse();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.false;
      });

      it('calls onMouseReleased if the mouse was pressed and released over the sprite', function() {
        moveMouseOver();
        pressMouse();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.true;
      });

      it('calls onMouseReleased if the mouse was pressed, moved over the sprite, and then released', function() {
        pressMouse();
        moveMouseOver();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.true;
      });

      it('does not call onMouseReleased on mouse-out if mouse is still down', function() {
        pressMouse();
        moveMouseOver();
        moveMouseOut();
        expect(sprite.onMouseReleased.called).to.be.false;
      });

      it('does not call onMouseReleased on release if mouse has left sprite', function() {
        moveMouseOver();
        pressMouse();
        moveMouseOut();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.false;
      });
    });
  });

  describe('setCollider()', function() {
    var sprite;

    beforeEach(function() {
      // Position: (10, 20), Size: (30, 40)
      sprite = pInst.createSprite(10, 20, 30, 40);
    });

    it('a newly-created sprite has no collider', function() {
      expect(sprite.collider).to.be.undefined;
    });

    it('throws if first argument is not "circle" or "rectangle"', function() {
      // Also throws if undefined
      expect(function() {
        sprite.setCollider();
      }).to.throw(TypeError, 'setCollider expects the first argument to be either "circle" or "rectangle"');

      // Note, it's case-sensitive
      expect(function() {
        sprite.setCollider('CIRCLE');
      }).to.throw(TypeError, 'setCollider expects the first argument to be either "circle" or "rectangle"');
    });

    it('can construct a circle collider with default radius and offset', function() {
      sprite.setCollider('circle');
      expect(sprite.collider).to.be.an.instanceOf(pInst.CircleCollider);
      expect(sprite.collider.center).to.eq(sprite.position);
      // Radius should be half of sprite's larger dimension.
      expect(sprite.collider.radius).to.eq(sprite.height / 2);
      // Offset should be zero
      expect(sprite.collider.offset).to.be.an.instanceOf(p5.Vector);
      expect(sprite.collider.offset.x).to.eq(0);
      expect(sprite.collider.offset.y).to.eq(0);
    });

    it('scaling sprite without animation does not affect default circle collider size', function() {
      sprite.scale = 0.25;
      sprite.setCollider('circle');
      expect(sprite.collider.radius).to.eq(sprite.height / 2);
    });

    it('can construct a circle collider with explicit radius and offset', function() {
      sprite.setCollider('circle', 1, 2, 3);
      expect(sprite.collider).to.be.an.instanceOf(pInst.CircleCollider);
      expect(sprite.collider.center).to.eq(sprite.position);
      expect(sprite.collider.offset).to.be.an.instanceOf(p5.Vector);
      expect(sprite.collider.radius).to.eq(3);
      expect(sprite.collider.offset.x).to.eq(1);
      expect(sprite.collider.offset.y).to.eq(2);
    });

    it('throws if creating a circle collider with 1, 2, or 4+ params', function() {
      expect(function() {
        sprite.setCollider('circle', 1);
      }).to.throw(TypeError, 'Usage: setCollider("circle") or setCollider("circle", offsetX, offsetY, radius)');
      expect(function() {
        sprite.setCollider('circle', 1, 2);
      }).to.throw(TypeError, 'Usage: setCollider("circle") or setCollider("circle", offsetX, offsetY, radius)');
      // setCollider('circle', 1, 2, 3) is fine
      expect(function() {
        sprite.setCollider('circle', 1, 2, 3, 4);
      }).to.throw(TypeError, 'Usage: setCollider("circle") or setCollider("circle", offsetX, offsetY, radius)');
      expect(function() {
        sprite.setCollider('circle', 1, 2, 3, 4, 5);
      }).to.throw(TypeError, 'Usage: setCollider("circle") or setCollider("circle", offsetX, offsetY, radius)');
    });

    it('can construct a rectangle collider with default dimensions and offset', function() {
      sprite.setCollider('rectangle');
      expect(sprite.collider).to.be.an.instanceOf(pInst.AABB);
      expect(sprite.collider.center).to.eq(sprite.position);
      // Extents should be sprite dimensions
      expect(sprite.collider.extents).to.be.an.instanceOf(p5.Vector);
      expect(sprite.collider.extents.x).to.eq(sprite.width);
      expect(sprite.collider.extents.y).to.eq(sprite.height);
      // Offset should be zero
      expect(sprite.collider.offset).to.be.an.instanceOf(p5.Vector);
      expect(sprite.collider.offset.x).to.eq(0);
      expect(sprite.collider.offset.y).to.eq(0);
    });

    it('scaling sprite without animation does not affect default rectangle collider size', function() {
      sprite.scale = 0.25;
      sprite.setCollider('rectangle');
      expect(sprite.collider.extents.x).to.eq(sprite.width);
      expect(sprite.collider.extents.y).to.eq(sprite.height);
    });

    it('can construct a rectangle collider with explicit dimensions and offset', function() {
      sprite.setCollider('rectangle', 1, 2, 3, 4);
      expect(sprite.collider).to.be.an.instanceOf(pInst.AABB);
      expect(sprite.collider.center).to.eq(sprite.position);
      expect(sprite.collider.extents).to.be.an.instanceOf(p5.Vector);
      expect(sprite.collider.extents.x).to.eq(3);
      expect(sprite.collider.extents.y).to.eq(4);
      expect(sprite.collider.offset).to.be.an.instanceOf(p5.Vector);
      expect(sprite.collider.offset.x).to.eq(1);
      expect(sprite.collider.offset.y).to.eq(2);
    });

    it('throws if creating a rectangle collider with 1, 2, 3, or 5+ params', function() {
      expect(function() {
        sprite.setCollider('rectangle', 1);
      }).to.throw(TypeError, 'Usage: setCollider("rectangle") or setCollider("rectangle", offsetX, offsetY, width, height)');
      expect(function() {
        sprite.setCollider('rectangle', 1, 2);
      }).to.throw(TypeError, 'Usage: setCollider("rectangle") or setCollider("rectangle", offsetX, offsetY, width, height)');
      expect(function() {
        sprite.setCollider('rectangle', 1, 2, 3);
      }).to.throw(TypeError, 'Usage: setCollider("rectangle") or setCollider("rectangle", offsetX, offsetY, width, height)');
      // setCollider('rectangle', 1, 2, 3, 4) is fine.
      expect(function() {
        sprite.setCollider('rectangle', 1, 2, 3, 4, 5);
      }).to.throw(TypeError, 'Usage: setCollider("rectangle") or setCollider("rectangle", offsetX, offsetY, width, height)');
      expect(function() {
        sprite.setCollider('rectangle', 1, 2, 3, 4, 5, 6);
      }).to.throw(TypeError, 'Usage: setCollider("rectangle") or setCollider("rectangle", offsetX, offsetY, width, height)');
    });
  });

  describe('friction', function() {
    var sprite;

    beforeEach(function() {
      sprite = pInst.createSprite();
    });

    it('has no effect on update() when set to 0', function() {
      sprite.velocity.x = 1;
      sprite.velocity.y = 1;
      sprite.friction = 0;
      sprite.update();
      expect(sprite.velocity.x).to.equal(1);
      expect(sprite.velocity.y).to.equal(1);
    });

    it('reduces velocity to zero on update() when set to 1', function() {
      sprite.velocity.x = 1;
      sprite.velocity.y = 1;
      sprite.friction = 1;
      sprite.update();
      expect(sprite.velocity.x).to.equal(0);
      expect(sprite.velocity.y).to.equal(0);
    });

    describe('axis-aligned', function() {
      beforeEach(function() {
        sprite.velocity.x = 16;
      });

      it('cuts velocity in half each update when set to 0.5', function() {
        sprite.friction = 0.5;
        expect(sprite.velocity.x).to.equal(16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(8);
        sprite.update();
        expect(sprite.velocity.x).to.equal(4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(2);
      });

      it('cuts velocity to one-quarter each update when set to 0.75', function() {
        sprite.friction = 0.75;
        expect(sprite.velocity.x).to.equal(16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(1);
        sprite.update();
        expect(sprite.velocity.x).to.equal(0.25);
      });
    });

    describe('not axis-aligned', function() {
      beforeEach(function() {
        sprite.velocity.x = 3 * 16;
        sprite.velocity.y = 4 * 16;
      });

      it('cuts velocity in half each update when set to 0.5', function() {
        sprite.friction = 0.5;
        expect(sprite.velocity.x).to.equal(3 * 16);
        expect(sprite.velocity.y).to.equal(4 * 16);
        expect(sprite.velocity.mag()).to.equal(5 * 16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 8);
        expect(sprite.velocity.y).to.equal(4 * 8);
        expect(sprite.velocity.mag()).to.equal(5 * 8);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 4);
        expect(sprite.velocity.y).to.equal(4 * 4);
        expect(sprite.velocity.mag()).to.equal(5 * 4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 2);
        expect(sprite.velocity.y).to.equal(4 * 2);
        expect(sprite.velocity.mag()).to.equal(5 * 2);
      });

      it('cuts velocity to one-quarter each update when set to 0.75', function() {
        sprite.friction = 0.75;
        expect(sprite.velocity.x).to.equal(3 * 16);
        expect(sprite.velocity.y).to.equal(4 * 16);
        expect(sprite.velocity.mag()).to.equal(5 * 16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 4);
        expect(sprite.velocity.y).to.equal(4 * 4);
        expect(sprite.velocity.mag()).to.equal(5 * 4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 1);
        expect(sprite.velocity.y).to.equal(4 * 1);
        expect(sprite.velocity.mag()).to.equal(5 * 1);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 0.25);
        expect(sprite.velocity.y).to.equal(4 * 0.25);
        expect(sprite.velocity.mag()).to.equal(5 * 0.25);
      });
    });
  });
});
