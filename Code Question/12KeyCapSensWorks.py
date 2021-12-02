# import time
# import board
# import busio
# import adafruit_mpr121

# i2c = busio.I2C(board.SCL, board.SDA)
# mpr121 = adafruit_mpr121.MPR121(i2c)

# while True:
#     if mpr121[0].value:
#         print("Pin 0 touched!")

import time
import board
import busio
import p9813


# Import MPR121 module.
import adafruit_mpr121


# setup Touch
i2c = busio.I2C(board.SCL, board.SDA)

#default address of 12 key capacitive sensor is 0X5B, but board waslooking for 5a adress.
#so change it
mpr121 = adafruit_mpr121.MPR121(i2c, address=0x5B)
print("hello")

while True:
    if (mpr121[0].value or mpr121[1].value or mpr121[2].value)== True:
        print("enteredd")
    else:
        print("no ")
