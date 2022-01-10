/*
References for these codes:
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/
var index = 0
var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem144101';    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino

var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

//Starting diameter circle.
let diam = 30;
let timer = 3000
let reset = false
let expired = false
let timeclick = 0
let setTime = false
let slowDown = false

//Radii of the dotted circles.
let r1 = 50;
let r2 = 80;
let r3 = 120;
let r4 = 160;
let r5 = 200;

//Number of dots in a circle.
let num = 20;

//Used for the calculation of the position of the dots.
let angle = 0;
var step;

//Initiate the x and y.
let x = [];
let y = [];

//Set up the states of the colours.
let state = [];
let moving;
let growing;
let red;
let blue;
let green;
let orange;

let topic = [];

//Set variable c for a gradually increasing the opacity.
c = 0;
m = 0;

timetouch = 0;
deletetime = 3000;
timelastresource = 0;

let coordinates = []

//variables for the explosion 
var center = {
  x:0,
  y:0
}
var magic = 0;
var circles = [];

//-- read txt file --- and create necessary lists
var arrYears = []
var years1 = []
var years2 = []
var years3 = []
var years4 = []

var arrQuestions = []
var questions1 = []
var questions2 = []
var questions3 = []
var questions4 = []

var images1 = []
var images2 = []
var images3 = []
var images4 = []
var index = 0

//Functions that returns true when the time of the question is finished ???
function timeExpired(){
  if(millis() - timeclick > timer) {

    expired = true
    reset = true
    return true
  }
}

//Functions that generates a random number between 0 and the max
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//Put the read years from the arrYears into their according arrays
function divideYears() {
  var year = 1
  for(let i = 0; i < arrYears.length; i++) {
    
    if(arrYears[i] == "") {
      year = year + 1
      print(i)
    }
    else if(year == 1) {
      years1.push(arrYears[i])
    }
    else if(year == 2) {
      years2.push(arrYears[i])
    }
    else if(year == 3) {
      years3.push(arrYears[i])
    }
    else if(year == 4) {
      years4.push(arrYears[i])
    }
  }
}

//Put the read questions from the arrQuestions into their according arrays
function divideQuestions() {
  var quest = 1
  var startIndex = 0
  var endIndex = 0
  for(let i = 0; i < arrQuestions.length; i++) {
    startIndex = arrQuestions[i].indexOf("'") + 1;
    print(startIndex)
    endIndex = arrQuestions[i].lastIndexOf("'");
    if(arrQuestions[i] == "") {
      quest = quest + 1
      print(i)
    }
    else if(quest == 1) {
      questions1.push(arrQuestions[i].substring(startIndex, endIndex))
    }
    else if(quest == 2) {
      questions2.push(arrQuestions[i].substring(startIndex, endIndex))
    }
    else if(quest == 3) {
      questions3.push(arrQuestions[i].substring(startIndex, endIndex))
    }
    else if(quest == 4) {
      questions4.push(arrQuestions[i].substring(startIndex, endIndex))
    }
  }
}

function loadImages(yearsList, imageList, color) {
  print("LOAD IMGAES FUNCTION")
  for(let i = 0; i < 2; i++) { //!!!yearsList.length; i++) {
    let shortArr = []
    for(let j = 0; j < 4; j++) {
      let name = "resources_right_names/resource_" + color + "_" + String(i+1) 
      + "_" + String(j+1) + ".png"
      resource = loadImage(name);
      print(name)
      shortArr.push(resource)
    }
    imageList.push(shortArr)
  }
  print("DONE LOADING")
}

function floatingBubblesRate(range){
  print("does action")
  for(let i = 0; i < coordinates.length; i++) {
    coordinates[i][0] = coordinates[i][0] + random(-range, range) //x-coordinate
    coordinates[i][1] = coordinates[i][1] + random(-range, range) //y-coordinate
    print(coordinates)

  }
}

function setBoundaries() {
  for(let i = 0; i < coordinates.length; i++) {
    if (coordinates[i][0] > 390){
      coordinates[i][0] = coordinates[i][0] -3
    }
    if (coordinates[i][0] < 10){
      coordinates[i][0] = coordinates[i][0] + 3
    }  
    if (coordinates[i][1] > 390){
      coordinates[i][1] = coordinates[i][1] -3
    }
    if (coordinates[i][1] < 130){
      coordinates[i][1] = coordinates[i][1] + 3
    }

  }
}

function drawResource(yearsList, imageList, questionList, r, g, b ){
  fill(parseInt(r), parseInt(g), parseInt(b) )
  noStroke();

  ellipse(x + 200, y + 200, 5);
  ellipse(200, 200, diam, diam);

  fill(255);
  textFont(Comfortaa);
  textSize(18);
  textAlign(CENTER);
  yearStr = String(yearsList[index])
  resourceYear = yearStr.substring(yearStr.length - 5, yearStr.length -1)
  print(resourceYear)
  resourceImage = imageList[index][0]
  text(resourceYear, 200, 207); 
  
  //fill(color)
  fill(parseInt(r), parseInt(g), parseInt(b) )
  if (diam > 100){
  //Per circle, make sure the right things are shown. When the first ring is filled, show the year of the resource in white and create the next ring in a slightly less bright red.
    image(resourceImage, 200, 243, 150, 210);
    fill(235, 60, 120);
    x = r2 * sin(angle);
    y = r2 * cos(angle);
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 160){
    resourceImage = imageList[index][1]
    //For the next ring, show the first image of the resource and again, draw the next ring in a less bright red colour.
    image(resourceImage, 199, 267, 228, 324); //resource_red_1_2, 199, 267, 228, 324);
  fill(215, 40, 100);
    x = r3 * sin(angle);
    y = r3 * cos(angle);
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 235){
    resourceImage = imageList[index][2]
    //For this ring, show the second image of the resource (the full resource) and again, draw the next ring in a less bright red colour.
    image(resourceImage, 202, 292, 336, 478); //resource_red_1_3, 202, 292, 336, 478);
    fill(195, 20, 80);
    x = r4 * sin(angle);
    y = r4 * cos(angle);
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 320){
    resourceImage = imageList[index][3]
    image(resourceImage, 203, 326, 455, 653);
    fill(175, 0, 60);
    x = r5 * sin(angle);
    y = r5 * cos(angle);
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 400){
    background(0,20);
    fill(0);
    rect(0, 0, width, height); //711, 400);
    
    
    for (var j = 0; j<circles.length; j++){
      circles[j].present();
    }
    
    for (var j = 0; j<circles.length; j++){
      circles[j].activate();
    } 
  

    fill(255);
    textSize(20);
    noStroke();
    //text(question_red_1, 57, 130, 300, 300);

    // fill(0);
    // rect(0, 0, 400, 400);
    // fill(255);
    // textSize(20);
    questionText = questionList[index]
    text(questionText, 57, 130, 300, 300);

    if (!setTime) {
      timeclick = millis()
      setTime = true
      print("first")
    }
    else if (timeExpired()) {
      reset = true
      setTime = false
      print("second")
      index = getRandomInt(imageList.length)
    }

  }

}



//#----------------------------------------
function preload(){
  //read the txt files for the years and questions
  arrYears = loadStrings("years_resources.txt")//assets/years.txt");
  arrQuestions = loadStrings("questions_resources.txt");
  Comfortaa = loadFont('Comfortaa-Regular.ttf')
}

function setup(){
  //Create a black canvas
  createCanvas(400, 400);
  background(0);

  //Set the starting positions of the four moving bubbles.
  x1 = random(20, 380);
  y1 = random(130, 380);
  c1 = [x1, y1]
  x2 = random(20, 380);
  y2 = random(130, 380);
  c2 = [x2,y2]
  x3 = random(20, 380);
  y3 = random(130, 380);
  c3 = [x3,y3]
  x4 = random(20, 380);
  y4 = random(130, 380);
  c4 = [x4,y4]
  coordinates = [c1,c2,c3,c4]
  print(coordinates)

  //Start the calculation of how big the steps are based on the number of dots you want.
  step = TWO_PI/num;

  //Make sure you align the center of the image.
  imageMode(CENTER);

  //Start in the state where the bubbles are moving.
  state = 'moving';

  //put the years and th questions string in their arrays
  divideYears()
  divideQuestions()

  //call loadImages method to fill the images in their according array
  loadImages(years1, images1, "red")
  loadImages(years2, images2, "blue")
  loadImages(years3, images3, "green")
  loadImages(years4, images4, "orange")

  //setup of the explosion
  center.x = width/2;
  center.y = height/2;
    
  circles[0] = new circle(center.x,center.y,80,300,20,5);
  circles[1] = new circle(center.x,center.y,60,280,10,3);
  circles[2] = new circle(center.x,center.y,40,280,10,4);
  circles[3] = new circle(center.x,center.y,20,260,10,5);
  circles[4] = new circle(center.x,center.y,10,260,10,5);

  
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

function draw(){
  if (reset) {
    background(0);
    center.x = width/2;
    center.y = height/2;
  
    circles[0] = new circle(center.x,center.y,80,300,20,5);
    circles[1] = new circle(center.x,center.y,60,280,10,3);
    circles[2] = new circle(center.x,center.y,40,280,10,4);
    circles[3] = new circle(center.x,center.y,20,260,10,5);
    circles[4] = new circle(center.x,center.y,10,260,10,5);

    c = 0
    state = "moving"
    diam =30
    reset = false
  }

  //Start with the situation of the moving bubbles.
  if (state == 'moving'){

    //Keep drawing a background, otherwise the bubbles will form a trail.
    background(0);

    fill(255);
    textFont(Comfortaa);
    textAlign(CENTER);
    textSize(20);
    topic = 'Travel through time with the KB and explore epidemics and pandemics!'
    text(topic, 25, 40, 350, 70);

    //If the mouse is pressed, the bubbles move slower, if the mouse is released, they move faster. In the real design, this should respond to a proximity sensor.
  if (slowDown){//{mouseIsPressed){ //slowDown
    "SLOWED DOWN"
    floatingBubblesRate(1)
  }
  else {
    floatingBubblesRate(9)
  }

  //Give boundaries as the bubbles may not leave the projection.
setBoundaries()

    //Fill the bubbles in the right colours and project them in the right place.
  noStroke();
    fill (255, 80, 140);
    ellipse(coordinates[0][0], coordinates[0][1], 30, 30);
    fill (20, 220, 230);
    ellipse(coordinates[1][0], coordinates[1][1], 30, 30);
    fill (0, 255, 70);
    ellipse(coordinates[2][0], coordinates[2][1], 30, 30);
    fill (210, 140, 0);
    ellipse(coordinates[3][0], coordinates[3][1], 30, 30);
  }
  //print(state)
  //If the state is either red or blue, start increasing c.
  if (state == 'red' || state == 'blue' || state == 'green' || state == 'orange'){
    fill(0, 0, 0, c);
    //print(c)
    if (0 <= c && c < 255){ //AND??
      //print(c)
      c = c + 1;
    }
    // if (state == "moving") {
    //   c = 0
    // }
    //c is now used to draw black circles, that increase in opacity, over the previously drawn circles. This way, it seems as if the circles are fading.
    fill (0, 0, 0, c);
    ellipse(coordinates[0][0], coordinates[0][1], 30, 30);
    ellipse(coordinates[1][0], coordinates[1][1], 30, 30);
    ellipse(coordinates[2][0], coordinates[2][1], 30, 30);
    ellipse(coordinates[3][0], coordinates[3][1], 30, 30);

    //
    textSize(20);
    text(topic, 25, 40, 350, 70);  ////makes black text?

    //Start calculating the locations of x and y for the dotted circles.
    var x = r1 * sin(angle);
    var y = r1 * cos(angle);
    angle = angle + step;

    //Now, if the state is red, use the red colour to draw the middle, growing circle and the first dotted circle.
    if (state == 'red'){
      drawResource(years1, images1, questions1, 255, 80, 140)
      // ellipse(x + 200, y + 200, 5);
      //  ellipse(200, 200, diam, diam);
      //  text(year_red_1, 200, 207);
      //   image(resource_red_1_1, 200, 243, 150, 210);
      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_red_1_2, 199, 267, 228, 324);
      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_red_1_3, 202, 292, 336, 478);
      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_red_1_4, 203, 326, 455, 653);
      //   ellipse(x + 200, y + 200, 5);
      //   rect(0, 0, 400, 400)
      //   text(question_red_1, 57, 130, 300, 300);

    }

    if (state == 'blue'){
      drawResource(years2, images2, questions2, 20, 220, 230)
      //  ellipse(x + 200, y + 200, 5);
      //  ellipse(200, 200, diam, diam);
      //  text(year_blue_1, 200, 207);

      // //Per circle, make sure the right things are shown. When the first ring is filled, show the year of the resource in white and create the next ring in a slightly less bright red.
      //   image(resource_blue_1_1, 200, 241, 150, 210);

      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_blue_1_2, 200, 263, 228, 324);

      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_blue_1_3, 198, 288, 333, 478);

      //   ellipse(x + 200, y + 200, 5);

      //   image(resource_blue_1_4, 196, 326, 455, 653);

      //   ellipse(x + 200, y + 200, 5);

      //   rect(0, 0, 400, 400);
;
      //   text(question_blue_1, 57, 130, 300, 300);

    }

    if (state == 'green'){
      drawResource(years3, images3, questions3, 0, 255, 70)
      // ellipse(x + 200, y + 200, 5);
      // ellipse(200, 200, diam, diam);
      // text(year_green_1, 200, 207);
      //   image(resource_green_1_1, 199, 226, 150, 210);
      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_green_1_2, 198, 240, 228, 324);
      //   fill(0, 215, 30);
      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_green_1_3, 198, 260, 330, 478);
      //   ellipse(x + 200, y + 200, 5);
      //   image(resource_green_1_4, 196, 280, 455, 653);
      //   ellipse(x + 200, y + 200, 5);
      //   rect(0, 0, 400, 400);
      //   text(question_green_1, 57, 130, 300, 300);


    }

    if (state == 'orange'){
      drawResource(years4, images4, questions4, 210, 140, 0)
      // ellipse(x + 200, y + 200, 5);
      // ellipse(200, 200, diam, diam);
      // text(year_orange_1, 200, 207);
  //       image(resource_orange_1_1, 199, 226, 150, 210);
  //       ellipse(x + 200, y + 200, 5);
  //       image(resource_orange_1_2, 198, 240, 228, 324);
  //       ellipse(x + 200, y + 200, 5);
  //       image(resource_orange_1_3, 198, 260, 330, 478);
  //       ellipse(x + 200, y + 200, 5);
  //       image(resource_orange_1_4, 196, 280, 455, 653);
  //       ellipse(x + 200, y + 200, 5);
  //       text(question_orange_1, 57, 130, 300, 300);

     }
   }
}

// Following functions print the serial communication status to the console for debugging purposes

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

function serialEvent() {
  // inData = Number(serial.read());
  const serialLine = serial.readLine();
  //print(serialLine)
  
  if(serialLine.length > 0){
    inData = serialLine
    if (inData == "slowDown") {
      slowDown = true
    }
    if (inData == "goFast") {
      slowDown = false
    }
    else {
      inData = parseInt(inData[0])
      patchTouched()
      
    }
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

//Function that determines the state by knowning which patch was touched
function patchTouched(){
  diam = diam + 10;
  //If a patched number is pressed, the diameter of the inner circle increases every time and the state changes to the corresponding colour.
  if (inData == 0){
    state = 'red';
  }
  if (inData == 1){
    state = 'blue';
  }
  if (inData == 2){
    state = 'green';
  }
  if (inData == 3){
    print("typed")
    state = 'orange';
    //print(state)
  }
}

//Function that determines the state by knowning which key was pressed
function keyTyped(){
  //print("typed" + key)
  //print("typed")
  diam = diam + 10;
  //If a keyboard number is pressed, the diameter of the inner circle increases every time and the state changes to the corresponding colour.
  if (key == 1){
    state = 'red';
  }
  if (key == 2){
    state = 'blue';
  }
  if (key == 3){
    state = 'green';
  }
  if (key == 4){
    print("typed")
    state = 'orange';
    print(state)
  }
}


class circle {
  
  constructor(centerX,centerY,rLow,rBig, num, strokeWidth){
    this.rLow = rLow;
    this.rBig = rBig;
    this.r = [];
    this.rgoal = rLow;
    this.num = num;
    this.cX = centerX;
    this.cY = centerY;
    this.speed = [];
    this.active = []
    this.locX = [];
    this.locY = [];
    this.strokeWidth = strokeWidth;
    for(var i=0; i<num;i++) {
      this.active[i] = false;
      this.r[i] = this.rLow;
      this.locX[i] = this.cX + cos((360*i)/this.num)*this.rLow;
      this.locY[i] = this.cY + sin((360*i)/this.num)*this.rLow;
      magic += 0.05;
    }
  }
  
  move(){
    for(var i = 0; i<this.num; i++){
      if (this.active[i]){
        this.r[i] += (this.rgoal-this.r[i])/this.speed[i]; // update radius
        if ((this.r[i] > this.rBig)||(this.r[i] < this.rLow)){ // Check if in the boundaries
          this.r[i] = this.rgoal;
          this.active[i] = false;
        }
        this.locX[i] = this.cX + cos((360*i)/this.num)*this.r[i]; 
        this.locY[i] = this.cY + sin((360*i)/this.num)*this.r[i]; // Update location
      }
    }
  }
  
  isActive(){
			for(var i = 0; i<this.num; i++){
        if(this.active[i]){
          return true;
        }
      }
    	return false;
  } 
  
  activate(){
    if (this.rgoal == this.rLow){ 
      this.rgoal = this.rBig;
// dit hier zorgt dat ie weer terug beweegt.
   } 
    //else {
      //this.rgoal = this.rLow;
    //} 
    for(var i = 0; i<this.num; i++){ 
      this.active[i] = true;
      this.speed[i] = random(10,50);
    }
  }
  
  present(){
    strokeWeight(this.strokeWidth);
    
    if (state == 'red'){
      stroke(255, 80, 140,200);
    }
    
    if (state == 'blue'){
      stroke(20, 220, 230,200);
    }
    
    if (state == 'green'){
      stroke(0, 255, 70,200);
    }
    
    if (state == 'orange'){
      stroke(210, 140, 0,200);
    }
    
    
    
    
    if (this.isActive()){
      this.move();
    }
    for(var i = 0; i<this.num; i++){
      point(this.locX[i],this.locY[i]);
    }
  }
  
}