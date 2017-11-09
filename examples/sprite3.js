//Changing the sprites' animations
//position and transformations: rotation, scale, mirror
//move the mouse and click
//press and hold the up and down keys

var ghost;

function setup() {
  createCanvas(800, 300);

  //create a sprite and add the 3 animations
  ghost = createSprite(400, 150, 50, 100);

  //label, first frame, last frame
  //the addAnimation method returns the added animation
  //that can be store in a temporary variable to change parameters
  var myAnimation = ghost.addAnimation('floating', 'assets/ghost_standing0001.png', 'assets/ghost_standing0007.png');
  //offX and offY is the distance of animation from the center of the sprite
  //in this case since the animations have different heights i want to adjust
  //the vertical offset to make the transition between floating and moving look better
  myAnimation.offY = 18;

  ghost.addAnimation('moving', 'assets/ghost_walk0001.png', 'assets/ghost_walk0004.png');

  ghost.addAnimation('spinning', 'assets/ghost_spin0001.png', 'assets/ghost_spin0003.png');

}

function draw() {
  background(255, 255, 255);

  //if mouse is to the left
  if(mouseX < ghost.position.x - 10) {
    ghost.changeAnimation('moving');
    //flip horizontally
    ghost.mirrorX(-1);
    //negative x velocity: move left
    ghost.velocity.x = -2;
  }
  else if(mouseX > ghost.position.x + 10) {
    ghost.changeAnimation('moving');
    //unflip
    ghost.mirrorX(1);
    ghost.velocity.x = 2;
  }
  else {
    //if close to the mouse, don't move
    ghost.changeAnimation('floating');
    ghost.velocity.x = 0;
  }

  if(mouseIsPressed) {
    //the rotation is not part of the spinning animation
    ghost.rotation -= 10;
    ghost.changeAnimation('spinning');
  }
  else
    ghost.rotation = 0;

  //up and down keys to change the scale
  //note that scaling the image quality deteriorates
  //and scaling to a negative value flips the image
  if(keyIsDown(UP_ARROW))
    ghost.scale += 0.05;
  if(keyIsDown(DOWN_ARROW))
    ghost.scale -= 0.05;

  //draw the sprite
  drawSprites();
}
