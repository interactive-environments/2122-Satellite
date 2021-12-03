#ATTEMPT SERIAL CONTROL WITH WIRE
import time
import board
import busio
import p9813
from digitalio import DigitalInOut, Direction
from analogio import AnalogIn


##Buzzer setup.
button = DigitalInOut(board.A2)
button.direction = Direction.INPUT

#Serial.begin(9600); // initialize the serial for communication
uart = busio.UART(board.TX, board.RX, baudrate=9600)

potentiometer = AnalogIn(board.A4)  # potentiometer connected to A1, power & ground

# Serial.write(brightness);
pin_clk = board.D2
pin_data = board.D3
num_leds = 1
chain = p9813.P9813(pin_clk, pin_data, num_leds)

def scale(sensorValue, mini, maxi):
    totalrange = maxi-mini# 50000-16000
    section = int(totalrange/255)
    sensorrange = sensorValue - mini #16000
    value = int(sensorrange/section)
    if (value > 255):
        return 255
    if value <= 0:
        return 0
    return value


go = True
while go: #True:
#    if button.value:
#         print("true")
#     else:
#         print("f")

    mini = 128
    maxi = 65520
    brightness = scale(potentiometer.value, mini, maxi)
    bytes1 = brightness.to_bytes(1, 'big') #how many bytes?
    jsonData = '{"type":"pot","value":' + str(brightness) + "}";
    print(jsonData) #add space?
    chain[0] = (brightness, brightness, 0)
    chain.write()

    time.sleep(0.1) # debounce delay
    #go = False




##_-----------------------

# For most CircuitPython boards:
#led = digitalio.DigitalInOut(board.LED)
# For QT Py M0:
# led = digitalio.DigitalInOut(board.SCK)
#led.direction = digitalio.Direction.OUTPUT


# while True:

#     data = uart.read(32)  # read up to 32 bytes
##    print(data)  # this is a bytearray type

#     if data is not None:
#         led.value = True

##        convert bytearray to string
#         data_string = 'hey'.join([chr(b) for b in data])
#         print(data_string, end="")

#         led.value = False
