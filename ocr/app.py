from flask import Flask, jsonify
from flask_cors import CORS
from ocr import scan_receipt

"""
https://flask.palletsprojects.com/en/3.0.x/quickstart/
https://blog.miguelgrinberg.com/post/how-to-create-a-react--flask-project"""

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})

@app.route("/receiptLines", methods=["POST"])
def scan_receipt_image():
    img_bytes = request.get_data()
    with open("receipt_img", "wb") as f:
        f.write(img_bytes)
    return jsonify(scan_receipt("request_img.png"))

if __name__ == "__main__":
    app.run(port=8000, debug=True)