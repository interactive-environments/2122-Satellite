import board
from analogio import AnalogIn
from digitalio import DigitalInOut, Direction
import p9813
import time
import pwmio
import busio
import adafruit_vl53l0x

button = DigitalInOut(board.D4)
button.direction = Direction.INPUT

potentiometer = AnalogIn(board.A2)  # potentiometer connected to A1, power & ground


# set chainable leds
pin_clk = board.D2
pin_data = board.D3
num_leds = 8
chain = p9813.P9813(pin_clk, pin_data, num_leds)
# for x in range(0,3):
#     chain[x] = (255,0,0)
#     chain.write()
#     print(x)

flicker = 0
buttonOn = True
startChainIndex = 3
chainLenght = 5

def flickerFunc():
    global flicker
    print(flicker)
    if flicker == 0:
        chain[2] = (0,0,0)
        chain[0] = (255,0,0)
        chain.write()
        flicker = 1
    elif flicker == 1:
        chain[0] = (0,0,0)
        chain[1] = (0,255,0)
        chain.write()
        flicker = 2
    elif flicker == 2:
        chain[1] = (0,0,0)
        chain[2] = (0,0,255)
        chain.write()
        flicker = 0


def nrLedsOn(totalLeds, minimum, maximum, value):
        totalLeds = totalLeds
        totalWidth = maximum - minimum
        part = totalWidth / totalLeds
        nr = int(value/part) +1
        if nr >= totalLeds:
            nr = totalLeds
            print(nr)
        return nr


timer_mark = 0
timer_duration = 0

def set_timer(duration):
    global timer_duration, timer_mark
    timer_duration = duration
    timer_mark = time.monotonic()

def timer_expired():
    global timer_mark, timer_duration
    if time.monotonic() - timer_mark > timer_duration:
        return True
    else:
        return False

set_timer(1)


while True:
    if button.value:
        buttonOn = not buttonOn

    nrLedsOnChain = nrLedsOn(chainLenght, 44, 65520, potentiometer.value)

    if buttonOn and nrLedsOnChain > 0:
        for i in range(0, startChainIndex):
            chain[i] = (0,0,0)
        valueColor = 10
        for i in range(startChainIndex, startChainIndex + nrLedsOnChain ):
            chain[i] = (0,valueColor, 0)
            valueColor = valueColor + 10
        chain[startChainIndex + nrLedsOnChain -1] = (0,255,0)
        for i in range(startChainIndex + nrLedsOnChain, num_leds):
            chain[i] = (0,0,0)
        chain.write()

    if not buttonOn:
        for i in range(startChainIndex, num_leds):
            chain[i] = (0, 0, 0)
            chain.write()
        if timer_expired():
            print("expired")
            flickerFunc()
            set_timer(0.8)

    nrLedsOn(3, 44, 65520, potentiometer.value)


    time.sleep(0.1)

