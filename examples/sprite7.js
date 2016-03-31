//Sprite drawing order
//new sprite are drawn on top of old ones
//click to sort the sprites depth according to their y coordinates

function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(255, 255, 255);

  //every 10 frames
  if(frameCount%10 == 0) {

    //create a sprite in a random position
    var newSprite = createSprite(random(0, width), random(0, height));
    //assign a random appearance
    var rnd = floor(random(0, 4));

    if(rnd == 0)
      newSprite.addAnimation('img', 'assets/box0001.png');
    if(rnd == 1)
      newSprite.addAnimation('img', 'assets/ghost_standing0004.png');
    if(rnd == 2)
      newSprite.addAnimation('img', 'assets/cloud_breathing0001.png');
    if(rnd == 3)
      newSprite.addAnimation('img', 'assets/square.png');

    //set a lifespan to avoid consuming all the memory
    newSprite.life = 1000;
  }

  //the newest sprites are drawn on the top
  drawSprites();
}

//unless the depths are directly set
function mousePressed() {

  //set the existing sprites' depths in relation to their position
  for(var i=0; i<allSprites.length; i++) {

    //sprites on the bottom will be drawn first
    allSprites[i].depth = allSprites[i].position.y;

    //you can link the scale to the y position to simulate perspective
    //allSprites[i].scale = map(allSprites[i].position.y, 0, height, 0.2, 1);
  }

}
