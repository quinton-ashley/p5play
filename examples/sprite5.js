//Accessing and deleting sprites
//click to create new sprites

var GRAVITY = 0.2;

function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(255, 255, 255);

  fill(0);
  textAlign(CENTER);
  text('Click to create a new sprite', width/2, height-20);

  //the best way to organize sprites is to use a custom group (see Group class)
  //however, all sprites are automatically added to a default group allSprites
  //that you can access like a normal array of objects

  for(var i=0; i<allSprites.length; i++)
  {
    var mySprite = allSprites[i];

    //adding a speed at 90 degrees (down)
    //equivalent to: mySprite.velocity.y += GRAVITY;
    mySprite.addSpeed(GRAVITY, 90);

    //even if they are out of the canvas, sprites keep getting updated
    //consuming precious memory
    //use Sprite.remove() to remove a sprite from the sketch
    if(mySprite.position.y > height + 100)
      mySprite.remove();
  }

  if(frameCount%10 == 0)
    print('Sprite in the scene: ' +allSprites.length);

  //draw the sprites
  drawSprites();
}

//every mouse press
function mousePressed() {
  //I create a sprite at mouse position
  var newSprite = createSprite(mouseX, mouseY);

  //assign an animation
  newSprite.addAnimation('normal', 'assets/asterisk.png', 'assets/triangle.png', 'assets/square.png', 'assets/cloud.png', 'assets/star.png', 'assets/mess.png', 'assets/monster.png');

  //and set it to a random frame
  newSprite.animation.stop();
  var f = round(random(0, newSprite.animation.getLastFrame()));
  newSprite.animation.changeFrame(f);
}
