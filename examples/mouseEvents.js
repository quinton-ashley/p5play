//mouse states and mouse events on sprites
//click and hold the mouse button while overing on the sprites

var asterisk;
var ghost;
var draggedSprite;

function setup() {
  createCanvas(800, 400);

  ghost = createSprite(200, 200);
  ghost.addAnimation('normal', 'assets/ghost_spin0001.png', 'assets/ghost_spin0003.png');
  //detect the mouse position and click on this sprite
  //if no collider is defined, the image bounding box will be checked
  ghost.mouseActive = true;

  asterisk = createSprite(600, 200);
  asterisk.addAnimation('normal', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');
  asterisk.addAnimation('stretch', 'assets/asterisk_stretching0001.png', 'assets/asterisk_stretching0008.png');
  var anim = asterisk.addAnimation('transform', 'assets/asterisk_circle0001.png', 'assets/asterisk_circle0008.png');

  //if defined, the collider will be used for mouse events
  asterisk.setCollider('circle', 0, 0, 64);

  //I can assign functions to be called upon specific mouse events
  //within the function "this" will reference the sprite that triggered the event
  asterisk.onMouseOver = function() {
    this.changeAnimation('stretch');
  };

  asterisk.onMouseOut = function() {
    this.changeAnimation('normal');
  };

  asterisk.onMousePressed = function() {
    this.changeAnimation('transform');
    this.animation.goToFrame(this.animation.getLastFrame());
    if (draggedSprite == null) {
      draggedSprite = this;
    }
  };

  asterisk.onMouseReleased = function() {
    this.changeAnimation('transform');
    this.animation.goToFrame(0);
    if (draggedSprite == this) {
      draggedSprite = null;
    }
  };

}

function draw() {
  background(255, 255, 255);

  if (draggedSprite != null) {
    draggedSprite.position.x = mouseX;
    draggedSprite.position.y = mouseY;
  }

  //if a sprite is mouseActive true I can check if the mouse is over its collider
  //and if the button is pressed
  if(ghost.mouseIsOver)
    ghost.rotation-= 10;

  ghost.visible = !ghost.mouseIsPressed;

  drawSprites();
}
