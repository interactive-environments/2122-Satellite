import board
import busio
import adafruit_vl53l0x
import neopixel
import time
from digitalio import DigitalInOut, Direction
from Votepad import Votepad
print("hi")
dir(board)
# Import MPR121 module.
import adafruit_mpr121

# setup Touch
i2c = busio.I2C(board.SCL, board.SDA)
#default address of 12 key capacitive sensor is 0X5B, but board waslooking for 5a adress.
#so change it
capts = adafruit_mpr121.MPR121(i2c, address=0x5B)

#rgb is now grb
# blue: (0, 80, 40) = (80, 0, 40)
# orange: (60, 15, 0) = (15, 60, 0)
#pink: 	rgb(255,105,180) = (105,255, 180)

pixel_pin = board.D5
nr_pixels = 50


blue = (80, 0, 40)
orange = (15, 60, 0)
pink = (60,255, 180)

colorList = [blue, orange, pink]


sideOneOn = False
sideTwoOn = False
#ID, index, sensor, color, date, nrVote

button = DigitalInOut(board.A2)
button.direction = Direction.INPUT
button2 = DigitalInOut(board.A4)
button2.direction = Direction.INPUT
button3 = DigitalInOut(board.A0)
button3.direction = Direction.INPUT

color1 = (255,0,0)
color2 = (0, 255,0)
color3= (0,0,255)
color4= (0,255,255)
votepad1 = Votepad(ID=1, ind=1, sensor=capts[0], color=color1, date="1990", nrVotes=0)
votepad2 = Votepad(2, 2, capts[1], color2, "2000", 0)
votepad3 = Votepad(3, 3, capts[2], color3, "1600", 0)
votepad4 = Votepad(4, 4, capts[3], color4, "1780", 0)
votepanelList = [votepad1, votepad2, votepad3, votepad4]

pixels = neopixel.NeoPixel(pixel_pin, nr_pixels, brightness = 1.5, auto_write = False)
prevVoteState1 = False
prevVoteState2 = False
prevVoteState3 = False
prevVoteState4 = False

def set_timer(ballNr, duration):
    timerDurationList[ballNr-1] = duration
    timerMarkList[ballNr-1] = time.monotonic()

def timer_expired(ballNr):
    if time.monotonic() - timerMarkList[ballNr-1] > timerDurationList[ballNr-1]:
        return True
    else:
        return False

def set(pixels, startIndex, endRange, color):
    for i in range(startIndex, endRange):
        pixels[i] = color
    pixels.show()

def shower(votepad, totalPixels, rowSize):
    pixels.brightness = 0.05
    time.sleep(0.8)
    color = votepad.color
    set(pixels, 5, 10, votepad.color)
    for i in range(10, totalPixels, rowSize):
        pixels.brightness = pixels.brightness + 0.2
        set(pixels, i, i+rowSize, votepad.color)
        time.sleep(0.2)
    time.sleep(1)
    pixels.fill((0,0,0))
    pixels.show()

while True: #False:

    for i in range(12):
        if capts[i].value:
            print('Input {} touched!'.format(i))

    if(votepad1.sensor.value != prevVoteState1):
        if votepad1.sensor.value:
            pixels[votepad1.ind]= votepad1.color
            pixels.show()
            shower(votepad1, 50,10)
            votepad1.addVote()
        else:
            prevVoteState1 = votepad1.sensor.value

    if(votepad2.sensor.value != prevVoteState2):
        if votepad2.sensor.value:
            pixels[votepad2.ind] = votepad2.color
            pixels.show()
            shower(votepad2, 50,10)
            votepad2.addVote()
    else:
        prevVoteState2 = votepad2.sensor.value

    if(votepad3.sensor.value != prevVoteState3):
        if votepad3.sensor.value:
            votepad3.addVote()
            pixels[votepad3.ind]= votepad3.color
            pixels.show()
            shower(votepad3, 50, 10)
    else:
        prevVoteState2 = votepad1.sensor.value

    if(votepad4.sensor.value != prevVoteState4):
        if votepad4.sensor.value:
            votepad4.addVote()
            pixels[votepad4.ind]= votepad4.color
            pixels.show()
            shower(votepad4, 50, 10)
    else:
        prevVoteState4 = votepad4.sensor.value

    pixels.show()
    for i in range(0,4):
        print(votepanelList[i].nrVotes)
    time.sleep(0.1)
