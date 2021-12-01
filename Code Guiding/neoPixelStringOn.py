import board
import busio
import adafruit_vl53l0x
import neopixel
print("hi")
dir(board)
#rgb is now grb


# blue: (0, 80, 40) = (80, 0, 40)
# orange: (60, 15, 0) = (15, 60, 0)

pixel_pin = board.D5
num_pixels = 50

pixels = neopixel.NeoPixel(pixel_pin, num_pixels, brightness = 1.5, auto_write = False)
#pixels2 = neopixel.NeoPixel(board.NEOPIXEL, 1)

while True:
    for i in range(0, num_pixels):
        if(i % 2 == 0):
            pixels[i] = (80, 0, 40)#80, 40, 0)#(0,80,40)
        else:
            #pixels[i] = (255,0,0) #(60,15,0)
            pixels[i] = (15, 60, 0)


    #pixels.fill(0,80,40))
    pixels.show()
