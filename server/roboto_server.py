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

    def reset_intensity():
        pass


@app.route('/')
def index():
    return 'Welcome to MR ROBOTO'

# big unit has big_unit_1 and big_unit_2
@app.route('/big_unit_A')
def big_unit_A(intensity):
    big_unit_channel_A.reset_intensity()

@app.route('/big_unit_B')
def big_unit_B(intensity):
    big_unit_channel_B.reset_intensity()

# little unit has little_unit_1 and little_unit_2
@app.route('/little_unit_A')
def little_unit_A(intensity):
    little_unit_channel_A.reset_intensity()

@app.route('/little_unit_B')
def little_unit_B(intensity):
    little_unit_B.reset_intensity()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

    GPIO.setmode(GPIO.BCM)

    big_unit_channel_A = Unit(3, 15, 1)
    big_unit_channel_B = Unit(27, 24, 1)

    little_unit_channel_A = Unit(17, 27, 1)
    little_unit_channel_B = Unit(23, 24, 1)
