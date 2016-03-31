//Controlling animations
//click, press and hold to see different behaviors
var circle, explode, sleep, glitch;

function preload() {

  sleep = loadAnimation('assets/asterisk_stretching0001.png', 'assets/asterisk_stretching0008.png');

  circle = loadAnimation('assets/asterisk_circle0000.png', 'assets/asterisk_circle0008.png');
  //by default animations loop but it can be changed
  circle.looping = false;

  explode = loadAnimation('assets/asterisk_explode0001.png', 'assets/asterisk_explode0011.png');

  glitch = loadAnimation('assets/asterisk.png', 'assets/triangle.png', 'assets/square.png', 'assets/cloud.png', 'assets/star.png', 'assets/mess.png', 'assets/monster.png');
  //by default an animation plays but you may not want that
  glitch.playing = false;
}

function setup() {
  createCanvas(800, 300);
}

function draw() {
  background(255, 255, 255);

  //playing an pausing an animation
  if(mouseIsPressed)
    sleep.play();
  else
    sleep.stop();

  //reading and changing the current frame
  if(explode.getFrame()==explode.getLastFrame())
    explode.changeFrame(7);

  //playing backward or forward toward a specific frame
  //returns to the initial frame if click and hold
  if(mouseIsPressed)
    circle.goToFrame(0);
  else
    circle.goToFrame(circle.getLastFrame());

  animation(sleep, 100, 150);
  animation(explode, 300, 150);
  animation(glitch, 500, 150);
  animation(circle, 700, 150);

}

function mousePressed() {
  //rewind on mouse pressed - change frame to 0
  explode.rewind();

  //move ahead one frame
  glitch.nextFrame();
  //glitch.previousFrame();
}
