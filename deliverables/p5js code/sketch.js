/*
References for these codes:
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/
var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/tty.SLAB_USBtoUART';    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino
var minWidth = 711//600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch

//set color of flickering ball to white if no flickercolor received
flickerR = 255;
flickerG = 255;
flickerB = 255;

//Starting diameter circle.
let diam = 280;
let timer = 8000
let reset = false
let expired = false
let timeclick = 0
let setTime = false
let slowDown = false
let timegoaway = 0
let v = 0;

//Radii of the dotted circles.
let r1 = 180;
let r2 = 225;
let r3 = 270;
let r4 = 315;
let r5 = 360;


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
let index = 2

var qrc1 = []
var qrc2 = []
var qrc3 = []
var qrc4 = []

var arrMetaData= [] //array stores metadata about each subject
var metaDataIndex = 0

// Other variables
var uartdata = "";
var isFlickering = true
let questionState = false
let topicName = ""
timetouch = 0;
deletetime = 3000;
timelastresource = 0;

//Variables that store indexes from symbols that can be found in metadata. Allows us use correct "names" or "indexes"
var startBracket;
var endBracket;
var commaIndex;
var startIndex;
var endIndex;
var startDot ;
var subjectName ;
var folderNr;
var metaDataIndex;
var loading = true
var sentence = ""


/**
 * Find correct Index to substract information from MetaData;
 * Depening on which subject is chosen by reloading page and pressing the keys "0" or "9", the index of the characters will be updated 
 */
function updateSubjectInfo() {
  sentence = arrMetaData[metaDataIndex]
  startBracket = sentence.indexOf("(");
  endBracket = sentence.indexOf(")");
  commaIndex = sentence.indexOf("-");
  startIndex = sentence.substring(startBracket + 1, commaIndex);
  endIndex = sentence.substring(commaIndex +1, endBracket);
  startDot = sentence.indexOf(".")
  subjectName = sentence.substring(startDot + 2, startBracket -1);
  folderNr = sentence.substring(0, startDot)
}


/**
 * Change varaiables 'expired' and 'reset' to true, when timer-seconds have passed since the last timeclick.
 * Functions that returns true when the time of the question is finished 
 * @return {Boolean} if timer has expired
 */
function timeExpired(){
  if(millis() - timeclick > timer) {
    expired = true
    reset = true
    return true
  }
}


/**
 * Functions that generates a random number between 0 and the max
 * @param  {Number} max
 * @return {Integer} randomized integer between 0 and max
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Divide the years in yearsArr into corresponding list for each timeperiod
 */
function divideYears() {
  print("DIVIDE YEARS FUNCTION")
  var year = 1
  for(let i = 2; i < arrYears.length; i++) {
    
    if(arrYears[i] == "") {
      year = year + 1
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

/**
 * Add two numbers together
 * Divide the questions in questionsArr into corresponding list for each timeperiod
 */
function divideQuestions() {
  print("DIVIDE QUESTIONS FUNCTION")
  topicName = arrQuestions[0]
  arrQuestions = arrQuestions.slice(2)
  var quest = 1
  var startIndex = 0
  var endIndex = 0
  for(let i = 0; i < arrQuestions.length; i++) {
    startIndex = arrQuestions[i].indexOf("=") + 3;
    endIndex = arrQuestions[i].lastIndexOf("?") + 1;
    if(arrQuestions[i] == "") {
      quest = quest + 1
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

/**
 * Load the images of the resources in correct list for each timeperiod
 */
function loadImages(yearsList, imageList, color, folderNr) {
  print("LOAD IMAGES FUNCTION")
  startIndex = parseInt(startIndex)
  endIndex = parseInt(endIndex)
  for(let i = startIndex; i < endIndex; i++) {
    let shortArr = []
    for(let j = 0; j < 4; j++) {
      let name = "resourceFolder" + folderNr 
      + " (" + subjectName + ")/resources " + color + "/" + "resource_" + color + "_" + String(i) 
      + "_" + String(j+1) + ".png"
      resource = loadImage(name)
      shortArr.push(resource)
    }
    imageList.push(shortArr)
  }
}

/**
 * Load the QR-codes of the resources in correct list for each timeperiod
 */
function loadQrc(yearsList, qrcNrList, color, folderNr) {
  print("LOAD QRCODES FUNCTION")
  for(let j = startIndex; j < endIndex; j++) { 
    print(yearsList)
    let name = "resourceFolder" + String(folderNr) 
    + " ("+ subjectName + ")/qr codes " + color + "/" + "qrc_" + color + "_" + String(j) + ".png"
    qrcode = loadImage(name);
    qrcNrList.push(qrcode)
  }
}

/**
 * Changes display of the screen when: user taps patch, or when timers (question/shrink) have expired.
 * Also loads the resource and qr-code images when not yet done.
 * Divides years and questions into correct sublists for each timeperiod.
 * @param  {List} yearsList list of years for a certain time period
 * @param  {List} imageList list of images for the same time period
 * @param  {List} questionList list of questions for the same time period
 * @param  {List} qrcNrList list of QR-codes for the same time period
 * @param  {Number} r r-value of rbg, showing the color of the timeperiod
 * @param  {Number} g g-value of rbg, showing the color of the timeperiod
 * @param  {Number} b b-value of rbg, showing the color of the timeperiod
 */
function drawResource(yearsList, imageList, questionList, qrcNrList, r, g, b ){
  if(loading) {
      //put the years and th questions string in their arrays
      print("HI I WAS IN LOADING")
      divideYears()
      divideQuestions()

      //call loadImages method to fill the images in their according array
      loadImages(years1, images1, "red", folderNr)
      loadImages(years2, images2, "blue", folderNr)
      loadImages(years3, images3, "green", folderNr)
      loadImages(years4, images4, "orange", folderNr)

      loadQrc(years1, qrc1, "red", folderNr)
      loadQrc(years2, qrc2, "blue", folderNr)
      loadQrc(years3, qrc3, "green", folderNr)
      loadQrc(years4, qrc4, "orange", folderNr)
      loading = false
  }

  fill(parseInt(r), parseInt(g), parseInt(b) )
  noStroke();

  ellipse(x + 200, y + 200, 5);
  ellipse(width/2, height/2, diam, diam);

  fill(255);
  textFont(Comfortaa);
  textSize(50);
  textAlign(CENTER);
  yearStr = String(yearsList[index])
  resourceYear = yearStr.substring(yearStr.indexOf("=") + 2, yearStr.lastIndexOf(";") - 1) //finds year
  resourceImage = imageList[index][0] //find image
  text(resourceYear, width/2, height/2 + 5); 

  //Code block shrinks the resources when reading time has elapsed
  if ((millis() - timegoaway > 8000) && !questionState){
      fill(0);
      rect(0, 0, 1440, 900);
      fill(r, g, b);
      diam = diam - 3;
      if (diam < 0){
        diam = 280;
        isFlickering = false
        state = 'moving';
      }
      if (diam > 630){
        diam = 280;
        expired = false
        timeclick = 0
        setTime = false
        reset = true;
        state = 'moving';
      }
      ellipse(width/2, height/2, diam, diam);
  }
  else{
      resourceQrc = qrcNrList[index]
      image(kblogo, 140, height/10, 200, 90) //show qr code
      image(resourceQrc, 150, (height/4+10), 150, 150);
  }

  //for each Diameter of the resource circle -> change image and image size when entering other if-statement
  fill(parseInt(r), parseInt(g), parseInt(b) )
  if (diam > 360){
    image(resourceImage, width/2, height/2, 360, 360)
    fill(235, 60, 120);
    x = r2 * sin(angle) + 448;
    y = r2 * cos(angle) + 200;
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 450){
    resourceImage = imageList[index][1]
    image(resourceImage, width/2, height/2, 450, 450); 
    fill(215, 40, 100);
    x = r3 * sin(angle) + 448; 
    y = r3 * cos(angle) + 200;
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 540){
    resourceImage = imageList[index][2]
    image(resourceImage, width/2, height/2, 540, 540); 
    fill(195, 20, 80);
    x = r4 * sin(angle) + 448;
    y = r4 * cos(angle) + 200;
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 630){
    resourceImage = imageList[index][3]
    image(resourceImage, width/2, height/2, 630, 630);
    fill(175, 0, 60);
    x = r5 * sin(angle) + 448;
    y = r5 * cos(angle) + 200;
    ellipse(x + 200, y + 200, 5);
  }
  if (diam > 710){ 
    background(0,20);
    fill(0);
    rect(0, 0, width, height); 
    
    //Code for explosion
    for (var j = 0; j<circles.length; j++){
      circles[j].present();
    }
    for (var j = 0; j<circles.length; j++){
      circles[j].activate();
    } 
    
    fill(255);
    textSize(35);
    noStroke();
    image(kblogo, 140, height/10, 200, 90)
    questionText = questionList[index]
    text(questionText, width/2 -300, height/2-60, 700, 300); 
    questionState = true
    //show question untill time has elapsed
    if (!setTime) {
      timeclick = millis()
      setTime = true
    }
    else if (timeExpired()) {
      reset = true
      setTime = false
      index = getRandomInt(imageList.length)
      questionState = false
    }
  }

}
   
//----------------------------------------------------------------------------------------------

/**
 * Loads the Metadata.txt, Kb-logo, letter-font
 */

function preload(){
  print("loadedsucces")
  arrMetaData = loadStrings("Metadata.txt");
  kblogo = loadImage("kblogo.png");
  Comfortaa = loadFont('Comfortaa-Regular.ttf')
}

/**
 * Updates subjectInfo (indexes of the metadata).
 * Load years.txt, load questions.txt.
 * Set up communication port with serial.
 * Prepare circles for explosion during question.
 */

function setup(){
  updateSubjectInfo()
  arrYears = loadStrings("resourceFolder" + String(folderNr) + " (" + subjectName + ")/years" + subjectName +".txt");
  arrQuestions = loadStrings("resourceFolder" + String(folderNr) + " ("+ subjectName + ")/questions"+ subjectName +".txt");
  
  //Create a black canvas
  createCanvas(1290, 800);
  background(0);

  //Start the calculation of how big the steps are based on the number of dots you want.
  step = TWO_PI/num;

  //Make sure you align the center of the image.
  imageMode(CENTER);

  //Start in the state where the bubbles are moving.
  state = 'moving';

  //setup of the explosion
  center.x = width/2;
  center.y = height/2;
    
  //set up circles of the explosion
  circles[0] = new circle(center.x,center.y,200,460, 20, 5)
  circles[1] = new circle(center.x,center.y,180,440,10,3);
  circles[2] = new circle(center.x,center.y,160,450,10,4);
  circles[3] = new circle(center.x,center.y,140,420,10,5);
  circles[4] = new circle(center.x,center.y,120,420,10,5);

  
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

/**
 * Draw is a looped function of p5, continuously called after the preload() and setup() function.
 * Checks is resource should be drawn, and calls that function.
 * Otherwise update flickeringBall color during "idle"/"moving" state.
 * Resets when going back into "idle"/"moving" state. 
 */
function draw(){
  if (reset) {
    background(0);
    center.x = width/2;
    center.y = height/2;
  
    //reset explosion bubbles
    circles[0] = new circle(center.x,center.y,200,460, 20, 5);
    circles[1] = new circle(center.x,center.y,180,440,10,3);
    circles[2] = new circle(center.x,center.y,160,450,10,4);
    circles[3] = new circle(center.x,center.y,140,420,10,5);
    circles[4] = new circle(center.x,center.y,120,420,10,5);

    c = 0
    state = "moving"
    diam = 280
    reset = false
  }

  //Start with the situation of the moving bubbles.
  if (state == 'moving'){
    //send message over uart cable: tell itsybitsy it may "flicker" again, since the is back to the moving state
    if(!isFlickering) {
      isFlickering = true
      serial.write("flicker")
    }

    //Keep drawing a background, otherwise the bubbles will form a trail.
    background(0);

    fill(255);
    textFont(Comfortaa);
    textAlign(CENTER);
    textSize(35);
    image(kblogo, 140, height/10, 200, 90)
    topic = 'Travel through time with the KB and explore ' + subjectName + "!"//arrMetaData[metaDataIndex]//topicName //epidemics and pandemics!'
    text(topic, width/2 -350, 60, 700, 120)//25, 40, 350, 70);
    //Fill the bubbles in the right colours and project them in the right place.
    noStroke();
    fill (flickerR, flickerG, flickerB); //fill colors of central ball in screen by the colors of the ledstring, data sent by itsybitsy
    ellipse(width/2, height/2, 265, 265)

  }
  //If the state is either red or blue, start increasing c.
  if (state == 'red' || state == 'blue' || state == 'green' || state == 'orange'){
    fill(0, 0, 0, c);
    if (0 <= c && c < 255){ 
      c = c + 1;
    }
    textSize(35);
    text(topic, width/2 -350, 60, 700, 120) //black text

    //Start calculating the locations of x and y for the dotted circles.
    var x = r1 * sin(angle) + 520;
    var y = r1 * cos(angle) + 250;
    angle = angle + step;

    //Now, if the state is red, use the red colour to draw the middle, growing circle and the first dotted circle.
    if (state == 'red') drawResource(years1, images1, questions1, qrc1, 255, 80, 140)
    if (state == 'blue') drawResource(years2, images2, questions2, qrc2,  20, 220, 230)
    if (state == 'green') drawResource(years3, images3, questions3, qrc3, 0,255, 70) 
    if (state == 'orange') drawResource(years4, images4, questions4, qrc4, 210, 140, 0) 
   }
}

/**
 * Following functions print the serial communication status to the console for debugging purposes
 */
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
  // Display the list the console:
  print(i + " " + portList[i]);
 }
}

/**
 * Prints whether connected to server
 */
function serverConnected() {
  print('connected to server.');
}

/**
 * Prints wheter serial port is opened
 */
function portOpen() {
  print('the serial port opened.')
}

/**
* Process the serial Data over the uart wire and assign to variable if needed.
*/
function serialEvent() {
  const serialLine = serial.readString()
  if(serialLine.length == 1){
    if(serialLine != "\n"){
      uartdata += serialLine
    }
    else{
      inData = uartdata
      print("indata", inData)
      //Itsybitsy will send string of current color it is flickering in -> bubble on projection should flicker the same color
      if(inData == "red") {
        flickerR = 255;
        flickerG = 80;
        flickerB = 140;
      }
      else if(inData == "blue") {
        flickerR = 20;
        flickerG = 220;
        flickerB = 230;
      }
      else if(inData == "orange") {
        flickerR = 210;
        flickerG = 140;
        flickerB = 0;
      }
      else if(inData == "green") {
        flickerR = 0;
        flickerG = 255;
        flickerB = 70;
      }
      else if (inData != "change") { //When patch is touched, itsybitsy will have sent the index of the according timeperiod color
        patchTouched()
      }
      uartdata = ""
    }
  }
}

/**
* Prints is something went wrong with serial port
*/
function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

/**
* Print if serial port is closed
*/
function portClose() {
  print('The serial port closed.');
}

/**
* Determines which state we go into when patch is Touched.
* State is determined by value sent by itsybitsy over uart
*/
function patchTouched(){
  //If a patched number is pressed, the diameter of the inner circle increases
  diam = diam + 30;
  timegoaway = millis();
  if (inData == 0){
    state = 'red';
  }
  if (inData == 1){
    state = 'blue';
  }
  if (inData == 2){
    state = 'orange';
  }
  if (inData == 3){
    state = 'green';
  }
}

/**
* Determines which state we go into when key is pressed.
* State is determined by value of key.
*/
function keyTyped(){
  //If a keyboard number is pressed, the diameter of the inner circle increases
  diam = diam + 30;
  timegoaway = millis();
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
    state = 'orange';
  }
  //after reloading page, if key 0 pressed, change subject to pandemics
  if (key == 0){
    print(sentence)
     metaDataIndex = metaDataIndex + 1
    if (metaDataIndex > 2) {
       metaDataIndex = 0;
      }
    loading = true
    setup()
    print("SENTENCE:", sentence)
  }
    //after reloading page, if key 0 pressed, change subject to transportation
  if (key == 9){
    print(sentence)
     metaDataIndex = metaDataIndex + 2
    if (metaDataIndex > 2) {
       metaDataIndex = 0;
      }
    loading = true
    setup()
    print("SENTENCE:", sentence)
  }
}



/**
* CIRCLE class; need for the final explosion during question.
* Class found on p5
*/
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
      isFlickering = false
      stroke(255, 80, 140,200);
    }
    
    if (state == 'blue'){
      isFlickering = false
      stroke(20, 220, 230,200);
    }
    
    if (state == 'green'){
      isFlickering = false
      stroke(0, 255, 70,200);
    }
    
    if (state == 'orange'){
      isFlickering = false
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