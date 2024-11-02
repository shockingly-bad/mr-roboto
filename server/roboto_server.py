import RPi.GPIO as GPIO
from flask import Flask

app = Flask(__name__)

class Unit:
    def __init__(self, up_bcm, down_bcm, initial_out):
        self.intensity = 0

        self.up_bcm = up_bcm
        self.down_bcm = down_bcm
        self.initial_out = initial_out

        # setup the up and down pins for the tens unit
        GPIO.setup(self.up_bcm, GPIO.out, initial=self.initial_out)
        GPIO.setup(self.up_bcm, GPIO.out, initial=self.initial_out)

    def get_intensity():
        return self.intensity

    def reset_intensity():
        for i in range(self.intensity + 2):
            GPIO.output(down_bcm, 0)
            sleep(0.01)
            GPIO.output(down_bcm, 1)
    
        self.intensity = 0
    
    def increase_intensity(difference):
        for i in range(difference):
            GPIO.output(up_bcm, 0)
            sleep(0.01)
            GPIO.output(up_bcm, 1)
        
        self.intensity += difference

    def decrease_intensity():
        for i in range(difference):
            GPIO.output(down_bcm, 0)
            sleep(0.01)
            GPIO.output(down_bcm, 1)
        
        self.intensity -= difference


@app.route('/')
def index():
    return 'Welcome to MR ROBOTO'

# big unit has big_unit_1 and big_unit_2
@app.route('/big_unit_A')
def big_unit_A(intensity):
    big_unit_channel_A.reset_intensity()

    current_intensity = big_unit_channel_A.get_intensity()
    difference = current_intensity - intensity
    
    if (difference > 0):
        big_unit_channel_A.increase_intensity(difference)
    else:
        difference = abs(difference)
        big_unit_channel_A.decrease_intensity(difference)


@app.route('/big_unit_B')
def big_unit_B(intensity):
    big_unit_channel_B.reset_intensity()

    current_intensity = big_unit_channel_B.get_intensity()
    difference = current_intensity - intensity
    
    if (difference > 0):
        big_unit_channel_B.increase_intensity(difference)
    else:
        difference = abs(difference)
        big_unit_channel_B.decrease_intensity(difference)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

    GPIO.setmode(GPIO.BCM)

    big_unit_channel_A = Unit(3, 15, 1)
    big_unit_channel_B = Unit(27, 24, 1)
