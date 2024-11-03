import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)

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
        for i in range(self.intensity + 5):
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