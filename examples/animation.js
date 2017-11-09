//Creating animations

//animations like p5 images should be stored in variables
//in order to be displayed during the draw cycle
var ghost, asterisk;

//it's advisable (but not necessary) to load the images in the preload function
//of your sketch otherwise they may appear with a little delay
function preload() {

  //create an animation from a sequence of numbered images
  //pass the first and the last file name and it will try to find the ones in between
  ghost = loadAnimation('assets/ghost_standing0001.png', 'assets/ghost_standing0007.png');

  //create an animation listing all the images files
  asterisk = loadAnimation('assets/asterisk.png', 'assets/triangle.png', 'assets/square.png', 'assets/cloud.png', 'assets/star.png', 'assets/mess.png', 'assets/monster.png');
}

function setup() {
  createCanvas(800, 300);
}

function draw() {
  background(255, 255, 255);

  //specify the animation instance and its x,y position
  //animation() will update the animation frame as well
  animation(ghost, 300, 150);
  animation(asterisk, 500, 150);
}
