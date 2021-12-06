import board
import busio
import adafruit_vl53l0x
import neopixel
import time
from digitalio import DigitalInOut, Direction
print("hi")
dir(board)
#rgb is now grb


# blue: (0, 80, 40) = (80, 0, 40)
# orange: (60, 15, 0) = (15, 60, 0)
#pink: 	rgb(255,105,180) = (105,255, 180)

pixel_pin = board.D5
nr_pixels = 50
nr_balls = 3
nr_leds_in_ball = int(nr_pixels/nr_balls)
blue = (80, 0, 40)
orange = (15, 60, 0)
pink = (60,255, 180)

colorList = [blue, orange, pink]
duration1 = 0
duration2 = 0
duration3 = 0
durationOneSide = 0
durationTwoSide = 0
timerDuration1 = 0
timerDuration2 = 0
timerDuration3 = 0
durationOneNext = 0
durationTwoNext = 0
timerDurationOneSide = 0
timerDurationTwoSide = 0
timerDurationNextOne = 0
timerDurationNextTwo = 0
timerMark1 = 0
timerMark2 = 0
timerMark3 = 0
timerMarkNextOne = 0
timerMarkNextTwo = 0
timerMarkOneSide = 0
timerMarkTwoSide = 0
durationList = [duration1, duration2, duration3, durationOneSide, durationTwoSide, durationOneNext, durationTwoNext]
timerDurationList = [timerDuration1, timerDuration2, timerDuration3, timerDurationOneSide, timerDurationTwoSide, timerDurationNextOne, timerDurationNextTwo]
timerMarkList =[timerMark1, timerMark2, timerMark3, timerMarkOneSide, timerMarkTwoSide, timerMarkNextOne, timerMarkNextTwo]

sideOneOn = False
sideTwoOn = False

button = DigitalInOut(board.A2)
button.direction = Direction.INPUT

button2 = DigitalInOut(board.A4)
button2.direction = Direction.INPUT

pixels = neopixel.NeoPixel(pixel_pin, nr_pixels, brightness = 1.5, auto_write = False)
buttonState = False
prevButtonState = False
prevButtonState2 = False

def set_timer(ballNr, duration):
    timerDurationList[ballNr-1] = duration
    timerMarkList[ballNr-1] = time.monotonic()

def timer_expired(ballNr):
    if time.monotonic() - timerMarkList[ballNr-1] > timerDurationList[ballNr-1]:
        return True
    else:
        return False

fadeOut = True

#def turnOn(ballSide, ballnr):
indexOne = -1
indexTwo = -1

while True:

    if(button.value != prevButtonState):
        if button.value:
            sideOneOn = True
            set_timer(4, 4)
            set_timer(6, 0.5)

        else:
            pass #print(button.value)
        prevButtonState = button.value

    if(button2.value != prevButtonState2):
        if button2.value:
            sideTwoOn = True
            set_timer(5, 4)
            set_timer(7, 0.5)
    else:
        pass #print(button2.value)
        prevButtonState2 = button2.value

    if (not timer_expired(5) and not timer_expired(4)):
        pass
    elif (sideOneOn and not timer_expired(4)):
        pixels.brightness = 1
        #print("entter")
        if(timer_expired(6)):
            print("expired1")
            indexOne = indexOne + 1
            if(indexOne >= nr_balls):
                indexOne = 0
            pixels.fill((0,0,0))
            pixels.show()
            for i in range(indexOne * nr_leds_in_ball, (indexOne+1) * nr_leds_in_ball):
                #print(i)
                pixels[i] = pink
            pixels.show
            set_timer(6, 0.5)

    elif (sideTwoOn and not timer_expired(5)):
        pixels.brightness = 1
        if(timer_expired(7)):
            print("expired2")
            indexTwo = indexTwo + 1
            if(indexTwo >= nr_balls):
                indexTwo = 0
            pixels.fill((0,0,0))
            pixels.show()
            for i in range(indexTwo * nr_leds_in_ball, (indexTwo+1) * nr_leds_in_ball):
                #print(i)
                pixels[i] = orange
                print(orange)
            pixels.show
            set_timer(7, 0.5)
    if (timer_expired(4)):
        indexOne = -1
        sideOneOn = False
    if (timer_expired(5)):
        indexTwo = -1
        sideTwoOn = False




    #PULSATING
    if(not sideOneOn and not sideTwoOn):
        print("fade")
        for i in range(0, nr_leds_in_ball):
            pixels[i] = pink
        for i in range(nr_leds_in_ball, nr_leds_in_ball *2):
            pixels[i] = orange
        for i in range(nr_leds_in_ball*2, nr_leds_in_ball*3):
            pixels[i] = blue

        if(fadeOut):
            pixels.brightness = pixels.brightness - 0.035
        else:
            pixels.brightness = pixels.brightness + 0.035
        if(pixels.brightness >=0.8):
            fadeOut = True
        if( pixels.brightness <=0.05):
            fadeOut = False

    pixels.show()




    pixels.show()
    time.sleep(0.1)
