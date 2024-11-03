from flask import Flask, request
from flask_cors import CORS
from tens_unit import Unit


app = Flask(__name__)
CORS(app)

API_KEY = "bobthekiller!"

big_unit_channel_A = Unit(3, 15, 1, 0.05)


@app.route("/")
def index():
    return "Welcome to MR ROBOTO"


@app.route("/big_unit_A")
def big_unit_A():
    if request.headers.get("Authorization") != API_KEY:
        return "Invalid API Key"

    current_intensity = big_unit_channel_A.get_intensity()
    new_intensity = int(request.args.get("intensity"))

    difference = new_intensity - current_intensity

    if difference == 0:
        big_unit_channel_A.safety_zero()
    elif difference > 0:
        big_unit_channel_A.increase_intensity(difference)
    else:
        difference = abs(difference)
        big_unit_channel_A.decrease_intensity(difference)

    return "A"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
