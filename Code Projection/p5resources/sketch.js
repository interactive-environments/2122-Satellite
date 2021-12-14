/*
References for these codes:
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/

var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem14401';    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino

var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch
//--
//Set variables for the time, so that the images disappear after a certain time. This time is called the deletetime, so you can change this.
var deletetime = 3000;
var timeclick = 0;
var m = 0;

function setup() {
    // set the canvas to match the window size
    // if (window.innerWidth > minWidth){
    //   width = window.innerWidth;
    // } else {
    //   width = minWidth;
    // }
    // if (window.innerHeight > minHeight) {
    //   height = window.innerHeight;
    // } else {
    //   height = minHeight;
    // }
  
  //Create a canvas in the right size. Load the fonts, and load a starting image.
  createCanvas(711, 400);
  Comfortaa = loadFont('Assets/Comfortaa-Regular.ttf');
  ComfortaaLight = loadFont('Assets/Comfortaa-Light.ttf');
  resource = loadImage('Assets/now.jpg');
  
  //Set starting positions for text and image, set these outside of the screen, so that you do not see them at first.
  x_location_image = -300;
  x_location_text = -300;
  
  //Set the right positions for where the year of the resource is shown (in the middle of the time period block).
  positionperiod1 = 120;
  positionperiod2 = 280;
  positionperiod3 = 430;
  positionperiod4 = 590;
  
  //Set a starting year.
  jaar = 0;
  
  //Set up the time variables. Add in milliseconds and start different timevariables that keep track of the time since a key was pressed.
  millis();
  timestart = millis();
  timeclick1 = 0;
  timeclick2 = 0;
  timeclick3 = 0;
  timeclick4 = 0;
  
  //Add the resources as images, name them per time period (ResourceTimeperiod_Number).
  resource1_1 = loadImage('assets/Period1_1.png');
  resource2_1 = loadImage('assets/Period2_1.png');
  resource2_2 = loadImage('assets/Period2_2.png');
  resource3_1 = loadImage('assets/Period3_1.png');
  resource3_2 = loadImage('assets/Period3_2.png');
  resource4_1 = loadImage('assets/Period4_1.jpg');
  resource4_2 = loadImage('assets/Period4_2.png');
  resource4_3 = loadImage('assets/Period4_3.png');
  resource4_4 = loadImage('assets/Period4_4.png');
  
  //Add the years corresponding to the images.
  jaar1_1 = 1618;
  jaar2_1 = 1782;
  jaar2_2 = 1743;
  jaar3_1 = 1881;
  jaar3_2 = 1807;
  jaar4_1 = 1918;
  jaar4_2 = 1940;
  jaar4_3 = 1903;
  jaar4_4 = 1927;

  //set up communication port
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
}

function draw() {
  //Start the timer functions for the different time periods. If the current time, minus the time of the last click is bigger than the deletetime, it draws a rectangle over the resource and its year, and one over the filled up timeline.
  //First time period - pink.
  if (millis() - timeclick1 > deletetime){
    fill(255, 255, 255);
    rect(40, 190, 165, 400);
    rect(44, 122, 153, 30, 10);
   }
  
  //Second time period - blue.
  if (millis() - timeclick2 > deletetime){
    fill(255);
    rect(205, 190, 160, 400);
    rect(201, 120, 153, 30, 10);
   }
  
  //Third time period - green.
  if (millis() - timeclick3 > deletetime){
    fill(255);
    rect(360, 190, 160, 400);
    rect(358, 120, 153, 30, 10);
   }
  
  //Fourth time period - orange.
  if (millis() - timeclick4 > deletetime){
    fill(255);
    rect(520, 190, 160, 400);
    rect(515, 120, 153, 30, 10);
   }
  
  //Draw the timeline as four rectangles with rounded corners in their own colour.
  strokeWeight(4);
  noFill();
  stroke(250, 0, 130);
  rect(44, 120, 153, 30, 10);
  stroke(20, 220, 230);
  rect(201, 120, 153, 30, 10);
  stroke(0, 230, 170);
  rect(358, 120, 153, 30, 10);
  stroke(255, 180, 80);
  rect(515, 120, 153, 30, 10);
  
  //Set the right settings for the text.
  noStroke();
  textAlign(CENTER, TOP);
  drawWords(width * 0.5);
}

function adjustResources(){
  //Create a function that responds to which key is typed. Keys '1', '2', '3', and '4', correspond to the four time periods.
  
  if (inData == 8){
    print(key)
    //If the first key is pressed, find a random resource from the collection of resources from the first time period.
    resourcesperiod1 = [resource1_1];
    resource = random(resourcesperiod1);
    
    //Now, set the right position for the image for this time period.
    x_location_image = 52;
    x_location_text = positionperiod1;
    
    //Create a white rectangle over the previous resource.
    fill(255);
    rect(x_location_text - 20, 190, 60, 30);
    
    //Create a coloured rectangle to fill the timeline.
    fill(250, 0, 130);
    rect(44, 122, 153, 30, 10);
    
    //Link the right year to the right image and show it.
    if (resource == resource1_1){
      jaar = jaar1_1;
      text(jaar, x_location_text, 190);
    }
    
    //Update the time since the button for the first time period was clicked.
    timeclick1 = millis();
  }
  
  //Do the exact same thing as for the first key. Just change the resources that can be chosen and set the right year for the right resource.
  if (inData == 9){
    resourcesperiod2 = [resource2_1, resource2_2];
    resource = random(resourcesperiod2);
    x_location_image = 205;
    x_location_text = positionperiod2;
    fill(255);
    rect(x_location_text - 20,190,60,30)
    fill(20, 220, 230);
    rect(201, 120, 153, 30, 10);
    if (resource == resource2_1){
      jaar = jaar2_1;
      text(jaar, x_location_text, 190);
    }
    if (resource == resource2_2){
      jaar = jaar2_2;
      text(jaar, x_location_text, 190);
    }
    timeclick2 = millis();
  }
  
  //Similar to the previous keys.
  if (inData == 10){
    resourcesperiod3 = [resource3_1, resource3_2];
    resource = random(resourcesperiod3);
    x_location_image = 360;
    x_location_text = positionperiod3;
    fill(255);
    rect(x_location_text - 20,190,60,30)
    fill(0, 230, 170);
    rect(358, 120, 153, 30, 10);
    if (resource == resource3_1){
      jaar = jaar3_1;
      text(jaar, x_location_text, 190);
    }
    if (resource == resource3_2){
      jaar = jaar3_2;
      text(jaar, x_location_text, 190);
    }
    timeclick3 = millis();
  }
  
  //Similar to the previous keys.
  if (inData == 11){
    resourcesperiod4 = [resource4_1, resource4_2, resource4_3, resource4_4];
    resource = random(resourcesperiod4);
    x_location_image = 520;
    x_location_text = positionperiod4;
    fill(255);
    rect(x_location_text - 20,190,60,30)
    fill(255, 180, 80);
    rect(515, 120, 153, 30, 10);
    if (resource == resource4_1){
      jaar = jaar4_1;
      text(jaar, x_location_text, 190);
    }
    if (resource == resource4_2){
      jaar = jaar4_2;
      text(jaar, x_location_text, 190);
    }
    if (resource == resource4_3){
      jaar = jaar4_3;
      text(jaar, x_location_text, 190);
    }
    if (resource == resource4_4){
      jaar = jaar4_4;
      text(jaar, x_location_text, 190);
    }
    timeclick4 = millis();
  }
    //Place the image that was randomly chosen at the position that corresponds to its time period.
    image(resource, x_location_image, 210, 149, 149);
}


function drawWords(x) {
  //Create a function to write all the texts. Start with the right settings (font, fill, and size) and write the question.
  textFont(Comfortaa);
  fill(0);
  textSize(25);
  text("In which time period did the government handle these pandemics most effectively?", 10, 35, 700, 100);
  
  //Write the dates a little smaller, in a lighter font, and set the right positions.
  textSize(15);
  textFont(ComfortaaLight);
  text ("1600", 40, 161, 20, 100);
  text("1700", 198, 161);
  text("1800", 356, 161);
  text("1900", 513, 161);
  text("2000", 668, 161);
  
  //This is the text size that the years of the resources will use.
  textSize(18);
}

function mousePressed(){
  //Also add a function where we can manually clear the screen by pressing a mouse button.
  clear();
  background(255);
}


function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

// function serialEvent() {
//   inData = Number(serial.read());
// }
function serialEvent() {
  //print("I like serials");
  const serialLine = serial.readLine();
  
  if(serialLine.length > 0){
    print(serialLine);
    //inData = serialLine
    inData = parseInt(serialLine)
    print(typeof(inData))
    adjustResources()
    // const packet = JSON.parse(serialLine);

    // print(packet);
    // print(packet.type);

    // if(packet.type == "pot"){
    //   inData = packet.value; //byteshiften mask etc
    //   //print(inData);
    // }
    
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

