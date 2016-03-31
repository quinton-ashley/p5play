//Collisions
//Collision between groups
//function called upon collision

var obstacles;
var collectibles;
var asterisk;

function setup() {
  createCanvas(800, 400);

  //create a user controlled sprite
  asterisk = createSprite(400, 200);
  asterisk.addAnimation('normal', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');

  asterisk.addAnimation('stretch', 'assets/asterisk_stretching0001.png', 'assets/asterisk_stretching0008.png');

  //create 2 groups
  obstacles = new Group();
  collectibles = new Group();

  for(var i=0; i<4; i++)
  {
    var box = createSprite(random(0, width), random(0, height));
    box.addAnimation('normal', 'assets/box0001.png', 'assets/box0003.png');
    obstacles.add(box);
  }

  for(var j=0; j<10; j++)
  {
    var dot = createSprite(random(0, width), random(0, height));
    dot.addAnimation('normal', 'assets/small_circle0001.png', 'assets/small_circle0001.png');
    collectibles.add(dot);
  }

}



function draw() {
  background(255, 255, 255);

  //if no arrow input set velocity to 0
  asterisk.velocity.x = (mouseX-asterisk.position.x)/10;
  asterisk.velocity.y = (mouseY-asterisk.position.y)/10;

  //asterisk collides against all the sprites in the group obstacles
  asterisk.collide(obstacles);

  //I can define a function to be called upon collision, overlap, displace or bounce
  //see collect() below
  asterisk.overlap(collectibles, collect);

  //if the animation is "stretch" and it reached its last frame
  if(asterisk.getAnimationLabel() == 'stretch' && asterisk.animation.getFrame() == asterisk.animation.getLastFrame())
  {
    asterisk.changeAnimation('normal');
  }

  drawSprites();
}

//the first parameter will be the sprite (individual or from a group)
//calling the function
//the second parameter will be the sprite (individual or from a group)
//against which the overlap, collide, bounce, or displace is checked
function collect(collector, collected)
{
  //collector is another name for asterisk
  //show the animation
  collector.changeAnimation('stretch');
  collector.animation.rewind();
  //collected is the sprite in the group collectibles that triggered
  //the event
  collected.remove();
}
