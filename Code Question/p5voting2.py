# #blue: (0, 80, 40) = (80, 0, 40)
# #orange: (60, 15, 0) = (15, 60, 0)
# #pink: 	rgb(255,105,180) = (105,255, 180)
#print("hi")
import board
import busio
import adafruit_vl53l0x
import neopixel
import time
from digitalio import DigitalInOut, Direction
from Votepad import Votepad
import adafruit_mpr121
from Touchpad import Touchpad

##default address of 12 key capacitive sensor is 0X5B, but board waslooking for 5a adress.
##setup Touch
i2c = busio.I2C(board.SCL, board.SDA)
capts = adafruit_mpr121.MPR121(i2c, address=0x5B)

pixel_pin = board.D5
nr_pixels = 200 #150#200#150
pixels = neopixel.NeoPixel(pixel_pin, nr_pixels, brightness = 1.5, auto_write = False)

color1 = (0,255,255) #pink
color2 = (0,0,255)   #blue
color3= (255,255,0)  #yellow
color4= (255,0,0)    #green
orange = (15, 60, 0)
pink1 = (60,255, 180)
blue = (0,0,255)
pink=(0,255,255)
yellow = (255,255,0)
green = (255,0,0)
#rgb is now grb
blue = (80, 0, 40)
orange = (15, 60, 0)
pink = (60,255, 180)
black = (0,0,0)
white = (255,255,255)
red = (0,255,0)

rightPulseOn = True
leftPulseOn = True
whitePulse = (0,0,150) #(150, 0, 0) #, 150, 0) #50) #255, 255, 255)
fadeOut = True
# ID, sensor, color, startBall, endBall, date
tp1 = Touchpad(1, capts[0], pink,  1, "1600")
tp2 = Touchpad(2, capts[1], green, 1, "1700")
tp3 = Touchpad(3, capts[2], yellow, 2, "1800")
tp4 = Touchpad(4, capts[3], orange, 2, "1900")
tpList = [tp1, tp2, tp3, tp4]

prevButtonState1 = False
prevButtonState2 = False
prevButtonState3 = False
prevButtonState4 = False
while True:
    if(tp1.sensor.value != prevButtonState1):
        if tp1.sensor.value:
            print(1)
            prevButtonState1 = tp1.sensor.value
            #print(tp1.toJSON())
        else:
            prevButtonState1 = tp1.sensor.value
    if(tp2.sensor.value != prevButtonState2):
        if tp2.sensor.value:
            print(2)
            #print(tp2.toJSON())
            prevButtonState2 = tp2.sensor.value
        else:
            prevButtonState2 = tp2.sensor.value
    if(tp3.sensor.value != prevButtonState3):
        if tp3.sensor.value:
            print(3)
            #print(tp3.toJSON())
            prevButtonState3 = tp3.sensor.value
        else:
            prevButtonState3 = tp3.sensor.value
    if(tp4.sensor.value != prevButtonState4):
        if tp4.sensor.value:
            print(4)
            #print(tp4.toJSON())
            prevButtonState4 = tp4.sensor.value
        else:
            prevButtonState4 = tp4.sensor.value


    time.sleep(0.1)
