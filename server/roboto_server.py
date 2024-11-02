import RPi.GPIO as GPIO
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Welcome to MR ROBOTO'

# big unit has big_unit_1 and big_unit_2
@app.route('big_unit_1')
def big_unit_1():
    pass

@app.route('big_unit_2')
def big_unit_2():
    pass

# little unit has little_unit_1 and little_unit_2
@app.route('little_unit_1')
def big_unit_1():
    pass

@app.route('little_unit_2')
def big_unit_2():
    pass

@app.route('initialise')
def initialise():
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(2, GPIO.out, initial=1)  # big unit channel A up
    GPIO.setup(3, GPIO.out, initial=1)  # big unit channel A down
    GPIO.setup(14, GPIO.out, initial=1)  # big unit channel B up
    GPIO.setup(15, GPIO.out, initial=1)  # big unit channel B down

    GPIO.setup(17, GPIO.out, initial=1)  # little unit channel A up
    GPIO.setup(27, GPIO.out, initial=1)  # little unit channel A down
    GPIO.setup(23, GPIO.out, initial=1)  # little unit channel B up
    GPIO.setup(24, GPIO.out, initial=1)  # little unit channel B down

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
