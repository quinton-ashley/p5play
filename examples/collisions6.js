//Overlap Point and pixel
//the collisions are not checked against bounding boxes but between
//points or image pixels

//left and right keys to move the sprite
//it's position is adjusted to another sprite's opaque pixels
var bottomTriangle;
var topTriangle;
var box;
var circle;
var platform;
var GRAVITY = 1;
var fps = null;

function setup() {
  createCanvas(800, 400);

  box = createSprite(400, 200, 100, 100);
  box.setCollider('rectangle', 0, 0, box.width, box.height);
  box.debug = true;

  circle = createSprite(200, 200, 100, 100);
  circle.setCollider('circle', 0, 0, 50);
  circle.debug = true;

  bottomTriangle = createSprite(200, 200, 200, 200);
  bottomTriangle.addAnimation('normal', 'assets/bottom_triangle.png');
  bottomTriangle.setCollider('pixel');
  bottomTriangle.debug = true;

  topTriangle = createSprite(600, 200, 200, 200);
  topTriangle.addAnimation('normal', 'assets/top_triangle.png');
  topTriangle.setCollider('pixel');
  topTriangle.debug = true;
}

function draw() {

  background(255, 255, 255);

  bottomTriangle.position.x = mouseX;
  bottomTriangle.position.y = mouseY;

  drawSprites();

  box.collide(bottomTriangle);

  circle.collide(bottomTriangle);

  topTriangle.collide(bottomTriangle);

  if(fps === null) {
    fps = round(frameRate());
  }
  if(frameCount % 40 === 0) {
    fps = round(frameRate());
  }
  noStroke();
  fill(154, 10, 20);
  textSize(20);
  text(fps + ' FPS', 10, 60);
}
