//Sprite Groups
//different groups are drawn in a diffent order and accessed as arrays

var clouds;
var ghosts;
var asterisk;

function setup() {
  createCanvas(800, 400);

  //in games you often have many sprites having similar properties behaviors
  //(e.g. pills and ghosts in pacMan)
  //You can use groups to organize and access them without having many global
  //variables. A sprite can belong to multiple groups.

  //create empty groups
  ghosts = new Group();
  clouds = new Group();

  asterisk = createSprite(random(0, width), random(0, height));
  asterisk.addAnimation('floating', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');

  //assign new sprites to the respective groups
  for(var i = 0; i<6; i++) {
    var newGhost = createSprite(random(0, width), random(0, height));
    newGhost.addAnimation('floating', 'assets/ghost_standing0001.png', 'assets/ghost_standing0007.png');
    ghosts.add(newGhost);
  }

  for(var j = 0; j<6; j++) {
    var newCloud = createSprite(random(0, width), random(0, height));
    newCloud.addAnimation('floating', 'assets/cloud_pulsing0001.png', 'assets/cloud_pulsing0007.png');
    //set a rotation speed
    newCloud.rotationSpeed = -2;
    //another way to add a sprite to a group
    newCloud.addToGroup(clouds);
  }
}

function draw() {
  background(255, 255, 255);

  //a group can be accessed like an array
  //the removed objects will be automatically removed from the groups as well
  for(var i = 0; i<ghosts.length; i++) {
    var g = ghosts[i];
    //moving all the ghosts y following a sin function (sinusoid)
    g.position.y += sin(frameCount/10);
  }

  asterisk.position.x = mouseX;
  asterisk.position.y = mouseY;

  //instead of drawing all sprites with drawSprites();
  //you can draw them selectively by group or single instance
  //in the order you want

  //e.g. even if the clouds should appear on the top of the ghosts
  //I impose a rendering before the others sprites
  drawSprites(clouds);
  drawSprites(ghosts);
  drawSprite(asterisk);
}
