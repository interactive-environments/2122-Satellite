import board
import busio
import adafruit_vl53l0x
import neopixel

i2c = busio.I2C(board.SCL, board.SDA)
sensor1 = adafruit_vl53l0x.VL53L0X(i2c)

pixel_pin = board.A2
num_pixels = 24

pixels = neopixel.NeoPixel(pixel_pin, num_pixels, brightness = 0.1, auto_write = False)

while True:
    if sensor1.range < 300:
        pixels.fill((255, 255, 255))
        pixels.show()
    if sensor1.range > 300:
        pixels.fill((0, 0, 0))
        pixels.show()
