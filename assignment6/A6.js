const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn,xCor,yCor,xFruit,yFruit,upDown,rightLeft,brightness; // Declare global variables
xCor = 0;
yCor = 0;
xFruit = 0;
yFruit = 0;
upDown = 0;
rightLeft = 0;
brightness = 0;

function setup() {
  setupSerial(); // Run our serial setup function (below)

  // Create a canvas that is the size of our browser window.
  // windowWidth and windowHeight are p5 variables
  createCanvas(windowWidth, windowHeight);
  frameRate(50);
  updateFruitCoordinates();
  noStroke();
  // p5 text settings. BOLD and CENTER are constants provided by p5.
  // See the "Typography" section in the p5 reference: https://p5js.org/reference/
  textFont("system-ui", 50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  background("blue");
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop
  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return.
  fill("green");
  clear(); 
  // Change text and colors based on button state. In p5, you can set colors
  // using standard CSS color names as well as many other color formats.
  let [a1, a2] = str.trim().split(",");
  upDown = int(a1);
  rightLeft = int(a2);
  updateSnakeCoordinates();
  checkGameStatus();
  ellipse(xCor, yCor, 40, 40);
  checkForFruit();
  light();
}

// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}

function updateSnakeCoordinates() {
  if (upDown > 520) {
    yCor = yCor + 10;
  }
  if (upDown < 500) {
    yCor = yCor - 10;
  }
  if (rightLeft > 520) {
    xCor = xCor + 10;
  }
  if (rightLeft < 500) {
    xCor = xCor - 10;
  }
}

function checkGameStatus() {
  if (xCor > width) {
    xCor = width;
  }
  if (xCor < 0){
    xCor = 0;
  }
  if (yCor > height){
    yCor = height;
  }
  if (yCor < 0){
    yCor = 0;
  }
}

function checkForFruit() {
  point(xFruit, yFruit);
  if ((xFruit-40) < xCor && xCor < (xFruit+40) && (yFruit-40) < yCor && yCor < (yFruit+40)) {
    fill("red");
    ellipse(xFruit, yFruit, 40, 40);
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  xFruit = random(width);
  yFruit = random(height);
}

function light (){
  //brightness = constrain(dist(xFruit,xCor,yFruit,yCor),0,255);
  brightness = constrain(xFruit-xCor,0,122)+constrain(yFruit-yCor,0,122);
  //map(dist(xFruit,xCor,yFruit,yCor),0,dist(0,0,width,height),0,255);
  port.write(brightness);
}