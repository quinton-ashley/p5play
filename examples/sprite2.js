//Changing the sprites' appearance
//press the mouse and move the cursor to control the animations

var boxSprite;
var imageSprite;
var animatedSprite;
var anotherAnimatedSprite;

function setup() {
  createCanvas(800, 300);

  //assets should be preloaded in the preload() function
  //to avoid delays in the visualization
  //but they can be loaded in setup() and draw() as well
  var img = loadImage('assets/asterisk.png');
  var animation = loadAnimation('assets/ghost_standing0001.png', 'assets/ghost_standing0007.png');

  //create a sprite with a placeholder rectangle as visual component
  boxSprite = createSprite(100, 150, 50, 100);
  //change the color of the placeholder
  boxSprite.shapeColor = color(222, 125, 2);

  //create a sprite and associate an existing image as visual component
  //it is not necessary to specify the dimensions
  imageSprite = createSprite(300, 150);
  imageSprite.addImage(img);

  //create a sprite and associate an existing animation as visual component
  //since a sprite can have multiple images and animations
  //the first parameter must be a label identifying the animation
  animatedSprite = createSprite(500, 150, 50, 100);
  animatedSprite.addAnimation('floating', animation);

  //alternative usage:
  //create a sprite and associate a non existing animation to it
  //the first parameter must be a label
  anotherAnimatedSprite = createSprite(700, 150, 50, 100);
  anotherAnimatedSprite.addAnimation('breathing', 'assets/cloud_breathing0001.png', 'assets/cloud_breathing0005.png');

}

function draw() {
  background(255, 255, 255);

  //all the methods and properties of the current animation will be
  //accessible from the .animation property of the sprite

  //stop/play a sprite animation
  if(mouseIsPressed)
    animatedSprite.animation.stop();
  else
    animatedSprite.animation.play();

  //change the frame in relation to the mouse x position
  var frame = round(map(mouseX, 0, width, 0, anotherAnimatedSprite.animation.getLastFrame()));
  //note: frames must be integer numbers so I have to round the result of map

  anotherAnimatedSprite.animation.changeFrame(frame);

  //draw all the sprites
  drawSprites();
}
