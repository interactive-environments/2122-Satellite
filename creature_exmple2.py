from components.button import Button
from components.buzzer import Buzzer
from components.led import LED
from components.slider import Slider

button = Button()
buzzer = Buzzer()
led = LED(1)
slider = Slider()

increase = True
led_power = 255
color = (1, 0, 0)


class Creature:

    def __init__(self):
        self.ecosystem = None

    def message(self, msg):
        global color
        print("recieved: " + str(msg))
        # Activate the buzzer if we recieve ping
        if msg == "ping":
            # Change led color to Green and turn of buzzer
            color = (0, 1, 0)
            buzzer.update(0)

        # Send the ping message when we recive pong
        if msg == "pong":
            # Change led color to Red and turn of buzzer
            color = (1, 0, 0)
            buzzer.update(0)

        if msg == "pow":
            # Turn on buzzer
            color = (0, 0, 0)
            buzzer.update(10)

    def sense(self):
        if button.sense() == True:
            return True

    # This method prepared the message to be sent and returns is
    def get_selected_message(self):
        #print("slider value is: ", slider.sense())
        maxSLider = 65520; #max value of the slider: want to divide slider in 3 intervals to determine which message is being sent
        if(slider.sense() > 45000):
            return "ping"
        elif(slider.sense() > 23000):
            return "pong"
        else: # (slider.value.value < 0)
            return "pow"

    # One iteration of the creatures main loop
    def loop(self):
        global increase, led_power, color

        # increase or decease the brightness by 1 every loop.
        if increase:
            led_power += 1
            if led_power > 255:
                led_power = 255
                increase = False
        else:
            led_power -= 1
            if led_power < 0:
                led_power = 0
                increase = True

        # show the led color
        actual_color = tuple([led_power * c for c in color])
        led.update_full_color(actual_color)
