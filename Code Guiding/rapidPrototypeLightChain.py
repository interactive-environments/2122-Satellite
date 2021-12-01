import board
from analogio import AnalogIn
from digitalio import DigitalInOut, Direction
import p9813
import time
import pwmio
import busio


# button = DigitalInOut(board.D4)
# button.direction = Direction.INPUT

potentiometer = AnalogIn(board.A2)  # potentiometer connected to A1, power & ground


# set chainable leds
pin_clk = board.D2
pin_data = board.D3
num_leds = 9
chain = p9813.P9813(pin_clk, pin_data, num_leds)
# for x in range(0,9):
#     chain[x] = (255,0,0)
#     chain.write()
#     print(x)

startChainIndex = 0
chainLenght = 9

def nrLedsOn(totalLeds, minimum, maximum, value):
        totalLeds = totalLeds
        totalWidth = maximum - minimum

        part = totalWidth / totalLeds
        #print(totalWidth, part)
        nr = int((value - minimum)/part) +1
        #print(nr, value)
        if nr >= totalLeds:
            nr = totalLeds

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
#while True:
    #print(potentiometer.value)

while True:


    nrLedsOnChain = nrLedsOn(chainLenght, 200, 65520, potentiometer.value)
    print(nrLedsOnChain)


    for i in range(0, startChainIndex):
        chain[i] = (0,0,0)
    valueColor = 255
    for i in range(startChainIndex, startChainIndex + nrLedsOnChain ):
        if (i < 10):
            chain[i] = (0,valueColor, 0)
        if (10 <= i < 15):
            chain[i] = (valueColor, 0, 0)
        if (15 <= i < 18):
            chain[i] = (0, 0, valueColor)

    for i in range(startChainIndex + nrLedsOnChain, num_leds):
        chain[i] = (0,0,0)
    chain.write()

    #nrLedsOn(3, 44, 65520, potentiometer.value)
#     nrLedsOn(3, , 38080, potentiometer.value)
   # print(potentiometer.value)

    time.sleep(0.1)
