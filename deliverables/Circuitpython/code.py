§import board
import busio
import time
from analogio import AnalogIn
import adafruit_vl53l0x
from digitalio import DigitalInOut, Direction
import neopixel
import p9813
print("hi")
dir(board)

i2c = busio.I2C(board.SCL, board.SDA)
#Set uart time out 0.005, default is 1 sec but takes too long (-> not so responsive)
uart = busio.UART(board.TX, board.RX, baudrate=9600, timeout=0.005)
#12-key capacitive touch sensor
capts = adafruit_mpr121.MPR121(i2c, address=0x5B)

#rgb is now grb
prevButtonState1 = False
prevButtonState2 = False
prevButtonState3 = False

pixel_pin = board.D5
nr_pixels = 100
start1 = 0
start2 = 100
pixels = neopixel.NeoPixel(pixel_pin, nr_pixels, brightness = 1.5, auto_write = False)
pin_clk = board.D2
pin_data = board.D3

#'red' || state == 'blue' || state == 'green' || state == 'orange'){
red = (0,255,0)
green = (255,0,0)
blue = (0,0,255)
purple = (255,255,0)
orange = (100, 255, 0) #50
blue = (80, 0, 40)
pink = (60,255, 180)
yellow = (255,255,0)
green = (255,0,0)
black = (0,0,0)

redLed = (255,0,0)
blueLed = (0,0,255)
orangeLed = (255, 105, 0)
greenLed = (0,255,0)

colorNames = ["red", "blue", "orange", "green"]
flickerColor = red

color1 = "null"
b1Stop = False
indexFlicker = 0
update = False

flickerDur = 0
flickerMark = 0

#Sets timer for the flicker
# @param duration: duration in seconds of timer
def set_flicker(duration):
    global flickerDur, flickerMark
    flickerDur = duration
    flickerMark = time.monotonic()

#Check if timer for flicker has expired
def flicker_expired():
    global flickerDur, flickerMark
    if time.monotonic() - flickerMark > flickerDur:
        return True
    else:
        return False

#Update flickerColor which holds the color of the current flicker
def updateFlickerColor():
    global flickerColor, indexFlicker, update
    if flicker_expired():
        indexFlicker = indexFlicker + 1
        if(indexFlicker > 3):
            indexFlicker = 0
        flickerColor = colorList[indexFlicker]
        set_flicker(1)
        update = True

#Turn on the leds in specific color
# @param color: a (r,g,b) - tuple
def fillBall1(color):
    global start1, start2
    for i in range(start1, start2):
        pixels[i] = color
    pixels.show()

k = 0
while True:
    updateFlickerColor()

    start = time.monotonic()
    data = uart.read(32)  # read up to 32 bytes
    end = time.monotonic()
    if data is not None:
        ##convert bytearray to string
        data_string = ''.join([chr(b) for b in data])
        print(data_string, end="")
        if data_string == "flicker":
            #print("enterflikcer")
            color1 = "null"
            b1Stop = False

    #if flickerColor has been updated, also update the colors of the leds
    # send colors of the bubble/leds over uart to p5
    if update:
        update = False
        if not b1Stop: #enters when it we are in a flickering state
            s1 = str(colorNames[indexFlicker]) + "\n"
            #print(s1)
            es1 = s1.encode()
            ba1 = bytearray(es1)
            uart.write(ba1)
            fillBall1(flickerColor)


    #if 12 key capacitive touch sensor index [0] has been activated:
    #send value of state over uart to itsybitsy
    #Keep colors of leds of bubble "locked" in same color
    if(capts[0].value != prevButtonState1):
        #We see 1 continous touch as 1 touch untill released
        if capts[0].value:
            prevButtonState1 = True
            if color1 == "null": #initialize
                color1 = flickerColor
                fillBall1(color1)
                b1Stop = True
                mayChangeColor = False
            s = str(value1) + "\n"
            print(s)
            es = s.encode()
            ba = bytearray(es)
            uart.write(ba)
            k = k +1
            #print(value1, 0, k)
        else:
            prevButtonState1 = False

    #Same as previous block for index [11]
    if(capts[11].value != prevButtonState2):
        #We see 1 continous touch as 1 touch untill released
        if capts[11].value:
            prevButtonState2 = True
            if color1 == "null": #initialize
                color1 = flickerColor
                fillBall1(color1)
                b1Stop = True
                mayChangeColor = False
            s = str(value1) + "\n"
            print(s)
            es = s.encode()
            ba = bytearray(es)
            uart.write(ba)
            k = k +1
            #print(value1, 11, k)
        else:
            prevButtonState2 = False

    #Same as previous block for index [10]
    if(capts[10].value != prevButtonState3):
        #We see 1 continous touch as 1 touch untill released
        if capts[10].value:
            prevButtonState3 = True
            if color1 == "null": #initialize
                color1 = flickerColor
                fillBall1(color1)
                b1Stop = True
                mayChangeColor = False
            s = str(value1) + "\n"
            print(s)
            es = s.encode()
            ba = bytearray(es)
            uart.write(ba)
            k = k +1
            #print(value1, 10, k)
        else:
            prevButtonState3 = False


    pixels.show()

    time.sleep(0.1)
