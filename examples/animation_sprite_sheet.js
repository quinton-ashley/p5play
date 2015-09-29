//Creating animations from sprite sheets
var sprite_sheet;
var sheet_animation;

function setup() {
  createCanvas(800, 225);

  // specify width and height of each frame and number of frames
  sheet_animation = loadAnimation('assets/explode_sprite_sheet.png', 171, 158, 11);

  // load the full sprite sheet for example reference only
  sprite_sheet = loadImage('assets/explode_sprite_sheet.png');
}

function draw() {
  clear();

  // animate the sprite sheet
  animation(sheet_animation, 100, 130);

  // show full sheet for example reference
  image(sprite_sheet, 250, 40, 500, 154);
}