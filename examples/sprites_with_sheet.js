//Creating sprite using sprite sheets for animation
var mouse_moved = false;
var touch_started = false;
var explode_sprite_sheet;
var player_sprite_sheet;
var tile_sprite_sheet;
var explode_sprite;
var player_walk;
var player_stand;
var player_sprite;

// Normally you would put this in a .json file, but I'm putting it here
// for example purposes
var player_frames = [
  {'name':'player_walk01', 'frame':{'x':0, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk02', 'frame':{'x':71, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk03', 'frame':{'x':142, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk04', 'frame':{'x':0, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk05', 'frame':{'x':71, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk06', 'frame':{'x':142, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk07', 'frame':{'x':213, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk08', 'frame':{'x':284, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk09', 'frame':{'x':213, 'y': 95, 'width': 70, 'height': 94}},
  {'name':'player_walk10', 'frame':{'x':355, 'y': 0, 'width': 70, 'height': 94}},
  {'name':'player_walk11', 'frame':{'x':284, 'y': 95, 'width': 70, 'height': 94}}
];

function preload() {
  //
  //  There are two different ways to load a SpriteSheet
  //     1. Given width, height that will be used for every frame and the
  //        number of frames to cycle through. The sprite sheet must have a
  //        uniform grid with consistent rows and columns.
  //     2. Given an array of frame objects that define the position and
  //        dimensions of each frame.  This is Flexible because you can use
  //        sprite sheets that don't have uniform rows and columns.
  //
  //    Below demonstrates both methods:


  // Load the explode sprite sheet using frame width, height and number of frames
  explode_sprite_sheet = loadSpriteSheet('assets/explode_sprite_sheet.png', 171, 158, 11);

  // Load player sprite sheet from frames array
  player_sprite_sheet = loadSpriteSheet('assets/player_spritesheet.png', player_frames);

  // Load the json for the tiles sprite sheet
  loadJSON('assets/tiles.json', function(tile_frames) {
    // Load tiles sprite sheet from frames array once frames array is ready
    tile_sprite_sheet = loadSpriteSheet('assets/tiles_spritesheet.png', tile_frames);
  });

  // Exploding star animation
  explode_animation = loadAnimation(explode_sprite_sheet);

  // Player walk animation passing in a SpriteSheet
  player_walk = loadAnimation(player_sprite_sheet);

  // An animation with a single frame for standing
  player_stand = loadAnimation(new SpriteSheet('assets/player_spritesheet.png',
    [{'name':'player_stand', 'frame':{'x':284, 'y': 95, 'width': 70, 'height': 94}}]));
}

function setup() {
  createCanvas(800, 400);

  // Create the exploding star sprite and add it's animation
  explode_sprite = createSprite(width / 2, 100, 171, 158);
  explode_sprite.addAnimation('explode', explode_animation);

  // Create the Player sprite and add it's animations
  player_sprite = createSprite(100, 284, 70, 94);
  player_sprite.addAnimation('walk', player_walk);
  player_sprite.addAnimation('stand', player_stand);
}

function draw() {
  clear();
  background(0);

  // Draw the ground tiles
  for (var x = 0; x < 840; x += 70) {
    tile_sprite_sheet.drawFrame('snow.png', x, 330);
  }

  // Draw the sign tiles
  tile_sprite_sheet.drawFrame('signExit.png', 700, 260);
  tile_sprite_sheet.drawFrame('signRight.png', 0, 260);

  // Mobile friendly controls
  var eventX;
  if (isTouch()) {
    eventX = touchX;
  } else {
    eventX = mouseX;
  }

  //if mouse is to the left
  if(eventX < player_sprite.position.x - 10) {
    player_sprite.changeAnimation('walk');
    // flip horizontally
    player_sprite.mirrorX(-1);
    // move left
    player_sprite.velocity.x = -2;
  }
  else if(eventX > player_sprite.position.x + 10) {
    player_sprite.changeAnimation('walk');
    // flip horizontally
    player_sprite.mirrorX(1);
    // move right
    player_sprite.velocity.x = 2;
  }
  else {
    player_sprite.changeAnimation('stand');
    //if close to the mouse, don't move
    player_sprite.velocity.x = 0;
  }

  //draw the sprite
  drawSprites();
}

function touchStarted() {
  touch_started = true;
}

function mouseMoved() {
  mouse_moved = true;
}

function isTouch() {
  return touch_started && !mouse_moved;
}
