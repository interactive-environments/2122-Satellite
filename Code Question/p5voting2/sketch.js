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
let hoogte1;
let hoogte2;
let hoogte3;
let hoogte4;

let hoogteimage1;
let hoogteimage2;
let hoogteimage3;
let hoogteimage4;

let hoogtecount1;
let hoogtecount2;
let hoogtecount3;
let hoogtecount4;

let hoogteplus1;

hoogte1 = 0;
hoogte2= 0;
hoogte3= 0;
hoogte4= 0;

hoogteimage1= 0;
hoogteimage2= 0;
hoogteimage3= 0;
hoogteimage4= 0;

hoogtecount1= 0;
hoogtecount2= 0;
hoogtecount3= 0;
hoogtecount4= 0;

hoogteplus1;

votecount1 =0;
votecount2=0;
votecount3=0;
votecount4=0;
votecounttotal = 0;

heightcollumn = 200

function preload() {
  Heading = loadFont('/assets/Comfortaa-Bold.ttf');
  kopje1 = loadFont('/assets/Comfortaa-Light.ttf');
  person = loadImage('/assets/person.png');
  sound1 = loadSound('/assets/sound1.mp3');
  //sound2 = loadSound('/assets/sound2.wav');
  //sound3 = loadSound('/assets/sound3.wav');
  // sound4 = loadSound('/assets/sound4.wav');
}

function setup() {
  // set the canvas to match the window size
  if (window.innerWidth > minWidth){
    width = window.innerWidth;
  } else {
    width = minWidth;
  }
  if (window.innerHeight > minHeight) {
    height = window.innerHeight;
  } else {
    height = minHeight;
  }

  //set up canvas
  createCanvas(711, 400);
  //createCanvas(width, height);
  noStroke();

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

  createCanvas(711, 400);
  
  
  let period1 = '1700s';
  let period2 = '1800s';
  let period3 = '1900s';
  let period4 = '2000s';
  let question = 'In which time period did the government handle past pandemics most effectively?';

}

// function draw() {
//   // set background to black
//   background(0);

//   // drawing the left side to visualize my LED light
//   var leftBrightness = map(inData, 0, 255, 0, 255);   // map input to the correct range of brightness
//   fill(leftBrightness);   // transfer the brightness to brightness of the color used for drawing
//   rect(0,0,width/2,height);   // left half

//   // draw the text - left
//   var textLColor = map(leftBrightness, 0, 255, 255,0);  // inverse the color for drawing the text on background
//   fill(textLColor);
//   textSize(16);
//   text("THE OTHER SIDE", 30, 30);
//   textSize(12);
//   text("BRIGHTNESS LEVEL: " + inData, 30, 50);    // displaying the input

//   // right side setup, using a variable for Part 3 purpose, currently it does not change
//   var rightBrightness = 0;
//   fill(rightBrightness);
//   rect(width/2,0,width/2,height);

//   // draw the text - right
//   var textRColor = map(rightBrightness, 0, 255, 255,0);
//   fill(textRColor);
//   textSize(16);
//   text("ME", width - 70, 30);
//   textSize(12);
//   text("BRIGHTNESS LEVEL: " + rightBrightness, width - 170, 50);

//   // draw the separator between frames
//   fill(255);
//   rect(width/2 - 0.5, 0, 1, height);
// }

// Following functions print the serial communication status to the console for debugging purposes



function adjustGraph() {
  
  hoogte1= votecount1/votecounttotal * heightcollumn;
  print("hoogte1", hoogte1)
  hoogte2= votecount2/votecounttotal * heightcollumn;
  hoogte3= votecount3/votecounttotal * heightcollumn;
  hoogte4= votecount4/votecounttotal * heightcollumn;
}

function draw() {
  print("drawing")
  
   background(255);
  
  let period1 = '1700s';
  let period2 = '1800s';
  let period3 = '1900s';
  let period4 = '2000s';
  let question = 'In which time period did the government handle past pandemics most effectively?'; 
  let total = 'Total';
  let plusvote = '+';
  

  
  if (votecount1>0){
    hoogteimage1 = 400-hoogte1-80;
    hoogtecount1 = 400-hoogte1-85;
    hoogteplus1 = 400-hoogte1-70;
    
    textFont(Heading);
    textSize(20);
    fill(250, 0, 130);
    
    text(plusvote,185.5,(hoogteplus1),100,100);
    fill(250, 0, 130);
    rect(155.5, 350, 40, -(hoogte1), 20);
    
    //sound1.play();
    
  }
  
  if (votecount2>0){
    hoogteimage2 = 400-hoogte2-80;
    hoogtecount2 = 400-hoogte2-85;
  }
  
  if (votecount3>0){
    hoogteimage3 = 400-hoogte3-80;
    hoogtecount3 = 400-hoogte3-85;
  }
  
  if (votecount4>0){
    hoogteimage4 = 400-hoogte4-80;
    hoogtecount4 = 400-hoogte4-85;
  }
  
  
 
  noStroke();
  
  //first bar chart
  fill(250, 0, 130,150);
  rect(155.5, 350, 40, -(hoogte1), 20);
  fill(20, 220, 230,150);
  rect(275.5, 350, 40, -(hoogte2), 20);
  fill(0, 230, 170,150);
  rect(395.5, 350, 40, -(hoogte3), 20);
  fill(255, 180, 80,150);
  rect(515.5, 350, 40, -(hoogte4), 20);
  
  //text with bar chart
  textFont(kopje1)
  textSize(10);
  fill(0, 0, 0);
  text(period1,165.5,360, 20,300);
  text(period2,285.5,360, 20,300);
  text(period3,405.5,360, 20,300);
  text(period4,525.5,360, 20,300);
  
  //text question 
  textFont(Heading)
  textSize(15);
  fill(0,0,0);
  text(question,140,35,500,200);
  
  //poppetje count
  image(person,155.5,(hoogteimage1),40,40);
  image(person,275.5,(hoogteimage2),40,40);
  image(person,395.5,(hoogteimage3),40,40);
  image(person,515.5,(hoogteimage4),40,40);
  
  textFont(kopje1)
  textSize(10);
  fill(0, 0, 0);
  text(votecount1,165.5,(hoogtecount1),40,40);
  text(votecount2,285.5,(hoogtecount2),40,40);
  text(votecount3,405.5,(hoogtecount3),40,40);
  text(votecount4,525.5,(hoogtecount4),40,40);
  
  
  //poppetje count total
  image(person,600,10,40,40);
  textFont(kopje1)
  textSize(10);
  fill(0, 0, 0);
  text(votecounttotal,630,18,40,40);
  text(total,580,18,40,40);
  
  
}

//function keyTyped() {
function activateVote(){
  print("inhere", key)
  //print(key)
  if (inData == 1){
    votecount1= votecount1 + 1;
    votecounttotal = votecounttotal + 1;
    adjustGraph()
    
  }
  else if (inData == 2){
    votecount2 = votecount2 + 1;
    votecounttotal = votecounttotal + 1;
    adjustGraph()
  }
  else if (inData== 3){
    votecount3= votecount3 + 1;
    votecounttotal = votecounttotal + 1;
    adjustGraph()
  } 
  else if (inData == 4){
    votecount4 = votecount4 + 1;
    votecounttotal = votecounttotal + 1;
    adjustGraph()
  
  }
  print("votecountTotal: " + votecounttotal 
        + "\nvotecount1: " + votecount1
       + "\nvotecount2: " + votecount2
       + "\nvotecount3: " + votecount3
       + "\nvotecount4: " + votecount4);
  //return false;
  
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
    activateVote()
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

