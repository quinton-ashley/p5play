//keyboard events
//capturing key presses and mouse buttons once
//press x and z or mouse left and right

var asterisk;
var ghost;
var platform;

var GRAVITY = 1;
var JUMP = 15;

function setup() {
  createCanvas(800, 400);

  ghost = createSprite(600, 200);
  ghost.addAnimation('normal', 'assets/ghost_spin0001.png', 'assets/ghost_spin0003.png');

  asterisk = createSprite(200, 200);
  asterisk.addAnimation('normal', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');
  asterisk.addAnimation('stretch', 'assets/asterisk_stretching0001.png', 'assets/asterisk_stretching0008.png');

  //if defined, the collider will be used for mouse events
  asterisk.setCollider('circle', 0, 0, 64);

  platform = createSprite(200, 300);
  platform.addAnimation('normal', 'assets/small_platform0001.png', 'assets/small_platform0003.png');
}

function draw() {
  background(255, 255, 255);

  fill(200);
  textAlign(CENTER);
  text('Press x and z', width/2, 20);

  asterisk.velocity.y += GRAVITY;

  if(asterisk.collide(platform)) {
    asterisk.velocity.y = 0;
    asterisk.changeAnimation('normal');
  }

  //keyDown returns true for a cycle if the key was just pressed
  //during this cycle. Useful to capture instant events in the draw cycle
  //without moving game logic to the mousePressed() function
  //mouseWentDown works the same way with mouse input
  if(keyWentDown('x') || mouseWentDown(LEFT))
  {
    asterisk.changeAnimation('stretch');
    asterisk.animation.rewind();
    asterisk.velocity.y = -JUMP;
  }

  //same as keyWentDown
  //RIGHT = right mouse button
  if(keyWentUp('z') || mouseWentUp(RIGHT))
    ghost.rotation = 0;

  //keyDown is similar to keyIsDown() except it accepts both key codes and characters
  if(keyDown('z') || mouseDown(RIGHT))
    ghost.rotation -= 10;

  drawSprites();
}
