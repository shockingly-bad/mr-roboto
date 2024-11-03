from flask import Flask, request
from flask_cors import CORS
from tens_unit import Unit


app = Flask(__name__)
CORS(app)

API_KEY = "bobthekiller!"

big_unit_channel_B = Unit(27, 24, 1, 0.07)


@app.route("/")
def index():
    return "Welcome to MR ROBOTO"


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
    app.run(host="0.0.0.0", port=4001)
