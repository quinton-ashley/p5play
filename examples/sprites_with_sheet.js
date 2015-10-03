//Creating sprite using sprite sheets for animation
var explode_sprite;
var player_walk;
var frames_json = '[{"x":0,"y":0,"width":171,"height":158},{"x":171,"y":0,"width":171,"height":158},{"x":342,"y":0,"width":171,"height":158},{"x":513,"y":0,"width":171,"height":158},{"x":684,"y":0,"width":171,"height":158},{"x":855,"y":0,"width":171,"height":158},{"x":0,"y":158,"width":171,"height":158},{"x":171,"y":158,"width":171,"height":158},{"x":342,"y":158,"width":171,"height":158},{"x":513,"y":158,"width":171,"height":158},{"x":684,"y":158,"width":171,"height":158}]';
var player_sprite;
var player_frames = [
  {"name":"p2_walk01", "x":0, "y": 0, "width": 70, "height": 94},
  {"name":"p2_walk02", "x":71, "y": 0, "width": 70, "height": 94},
  {"name":"p2_walk03", "x":142, "y": 0, "width": 70, "height": 94},
  {"name":"p2_walk04", "x":0, "y": 95, "width": 70, "height": 94},
  {"name":"p2_walk05", "x":71, "y": 95, "width": 70, "height": 94},
  {"name":"p2_walk06", "x":142, "y": 95, "width": 70, "height": 94},
  {"name":"p2_walk07", "x":213, "y": 0, "width": 70, "height": 94},
  {"name":"p2_walk08", "x":284, "y": 0, "width": 70, "height": 94},
  {"name":"p2_walk09", "x":213, "y": 95, "width": 70, "height": 94},
  {"name":"p2_walk10", "x":355, "y": 0, "width": 70, "height": 94},
  {"name":"p2_walk11", "x":284, "y": 95, "width": 70, "height": 94},
];


function preload() {
  // specify width and height of each frame and number of frames
  sheet_animation = loadAnimation('assets/explode_sprite_sheet.png', JSON.parse(frames_json));
  player_walk = loadAnimation('assets/p2_spritesheet.png', player_frames);
}

function setup() {
  createCanvas(900, 325);

  explode_sprite = createSprite(500, 150, 171, 158);
  explode_sprite.addAnimation('explode', sheet_animation);

  player_sprite = createSprite(100, 150, 70, 94);
  player_sprite.addAnimation('walk', player_walk);
}

function draw() {
  clear();

  //if mouse is to the left
  if(mouseX < explode_sprite.position.x - 10) {
    //negative x velocity: move left
    explode_sprite.velocity.x = - 2;
  }
  else if(mouseX > explode_sprite.position.x + 10) {
    explode_sprite.velocity.x = 2;
  }
  else {
    //if close to the mouse, don't move
    explode_sprite.velocity.x = 0;
  }

  //draw the sprite
  drawSprites();
}
