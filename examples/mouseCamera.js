//mouse events on sprites while using the camera
// rollover sprites to trigger mouse events

var s1;
var s2;

function setup() {
  createCanvas(800, 400);
  s1 = createSprite(width/2, height/2, 200, 200);
  
  s1.onMouseOver = function() {
    this.rotation+=10;
  }
  
  s2 = createSprite(30, 30, 20, 20);
  
  s2.onMouseOver = function() {
    this.rotation+=10;
  }
}

function draw() {
  background("#FFFFFF");
  
  camera.position.x++;
  
  if(s1.mouseIsOver)
    s1.shapeColor=color("#ff0000");
  else
    s1.shapeColor=color("#224477");
  
  drawSprite(s1);
  
  camera.off();
  
  //camera is off - this sprite is drawn in the screen space like a UI
  
  if(s2.mouseIsOver)
    s2.shapeColor=color("#ff0000");
  else
    s2.shapeColor=color("#224477");
  
  drawSprite(s2);

}



