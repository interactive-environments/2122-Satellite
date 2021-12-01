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
potentiometer2 = AnalogIn(board.A4)

# set chainable leds
pin_clk = board.D2
pin_data = board.D3
num_leds = 9
chain = p9813.P9813(pin_clk, pin_data, num_leds)

pin_clk2 = board.D4
pin_data2 = board.D7
num_leds2 = 7
chain2 = p9813.P9813(pin_clk2, pin_data2, num_leds2)
# for x in range(0,9):
#     chain[x] = (255,0,0)
#     chain.write()
#     print(x)

startChainIndex = 0
chainLenght = 9

startChainIndex2= 0
chainLenght2 = 7

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

# while True:
#     print(potentiometer2.value)
#     time.sleep(0.1)

while True:


    nrLedsOnChain = nrLedsOn(chainLenght, 200, 65520, potentiometer.value)
    #print(nrLedsOnChain)
    nrLedsOnChain2 = nrLedsOn(chainLenght2, 35600, 65520, potentiometer2.value)
    print(nrLedsOnChain2)


    for i in range(0, startChainIndex):
        chain[i] = (0,0,0)
    valueColor = 255
    for i in range(startChainIndex, startChainIndex + nrLedsOnChain ):
        chain[i] = (0,valueColor, 0)

    for i in range(startChainIndex + nrLedsOnChain, num_leds):
        chain[i] = (0,0,0)
    chain.write()

    #-----
    for k in range(0, startChainIndex2):
        chain2[k] = (0,0,0)
    valueColor2 = 255
    for k in range(startChainIndex2, startChainIndex2 + nrLedsOnChain2 ):
        chain2[k] = (0,0, valueColor2)

    for k in range(startChainIndex2 + nrLedsOnChain2, num_leds2):
        chain2[k] = (0,0,0)
    chain2.write()


    time.sleep(0.1)
