function setup() {
  // Sets the screen to be 640 pixels wide and 360 pixels high
  createCanvas(720, 400);
}

function draw() {
  // Set the background to black and turn off the fill color
  background(0);
  noFill();

  // The two parameters of the point() method each specify
  // coordinates.
  // The first parameter is the x-coordinate and the second is the Y
  stroke(255);
  point(width * 0.5, height * 0.5);
  point(width * 0.5, height * 0.25);

  // Coordinates are used for drawing all shapes, not just points.
  // Parameters for different functions are used for different
  // purposes. For example, the first two parameters to line()
  // specify the coordinates of the first endpoint and the second
  // two parameters specify the second endpoint
  stroke(0, 153, 255);
  line(0, height*0.33, width, height*0.33);

  // By default, the first two parameters to rect() are the
  // coordinates of the upper-left corner and the second pair
  // is the width and height
  stroke(255, 153, 0);
  rect(width*0.25, height*0.1, width * 0.5, height * 0.8);
}
