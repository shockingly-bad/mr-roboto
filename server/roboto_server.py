import RPi.GPIO as GPIO
from flask import Flask, request
from flask_cors import CORS
from time import sleep

app = Flask(__name__)
CORS(app)

GPIO.setmode(GPIO.BCM)

API_KEY = "bobthekiller!"

SAFETY_DOWN_NUMBER = 20


class Unit:
    def __init__(self, up_bcm, down_bcm, initial_out):
        self.intensity = 0

        self.up_bcm = up_bcm
        self.down_bcm = down_bcm
        self.initial_out = initial_out

        # setup the up and down pins for the tens unit
        GPIO.setup(self.up_bcm, GPIO.OUT, initial=self.initial_out)
        GPIO.setup(self.down_bcm, GPIO.OUT, initial=self.initial_out)

    def get_intensity(self):
        return self.intensity

    def safety_zero(self):
        for i in range(SAFETY_DOWN_NUMBER):
            GPIO.output(self.down_bcm, 0)
            sleep(0.05)
            GPIO.output(self.down_bcm, 1)
            sleep(0.05)

        self.intensity = 0

    def increase_intensity(self, difference):
        for i in range(difference):
            GPIO.output(self.up_bcm, 0)
            sleep(0.05)
            GPIO.output(self.up_bcm, 1)
            sleep(0.05)

        self.intensity += difference

    def decrease_intensity(self, difference):
        for i in range(difference):
            GPIO.output(self.down_bcm, 0)
            sleep(0.05)
            GPIO.output(self.down_bcm, 1)
            sleep(0.05)

        self.intensity -= difference


big_unit_channel_A = Unit(3, 15, 1)
big_unit_channel_B = Unit(27, 24, 1)


@app.route("/")
def index():
    return "Welcome to MR ROBOTO"


# big unit has big_unit_1 and big_unit_2
@app.route("/big_unit_A")
def big_unit_A():
    if request.headers.get("Authorization") != API_KEY:
        return "Invalid API Key"

    current_intensity = big_unit_channel_A.get_intensity()
    new_intensity = int(request.args.get("intensity"))

    difference = new_intensity - current_intensity

    if new_intensity == 0:
        big_unit_channel_A.safety_zero()
    elif difference > 0:
        big_unit_channel_A.increase_intensity(difference)
    else:
        difference = abs(difference)
        big_unit_channel_A.decrease_intensity(difference)

    return "A"


@app.route("/big_unit_B")
def big_unit_B():
    if request.headers.get("Authorization") != API_KEY:
        return "Invalid API Key"

    current_intensity = big_unit_channel_B.get_intensity()
    new_intensity = int(request.args.get("intensity"))

    difference = new_intensity - current_intensity

    if new_intensity == 0:
        big_unit_channel_B.safety_zero()
    elif difference > 0:
        big_unit_channel_B.increase_intensity(difference)
    else:
        difference = abs(difference)
        big_unit_channel_B.decrease_intensity(difference)

    return "B"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
