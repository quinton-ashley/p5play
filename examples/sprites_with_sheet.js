//Creating sprite using sprite sheets for animation
var sheet_animation;
var explode_sprite;

function preload() {
  // specify width and height of each frame and number of frames
  sheet_animation = loadAnimation('assets/explode_sprite_sheet.png', 171, 158, 11);
}

function setup() {
  createCanvas(800, 225);

  explode_sprite = createSprite(400, 150, 171, 158);
  explode_sprite.addAnimation('explode', sheet_animation);
}

function draw() {
  clear();

  //draw the sprite
  drawSprites();
}
