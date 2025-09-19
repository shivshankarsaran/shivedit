# http://127.0.0.1:5000/
import os
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import cv2 as cv

UPLOAD_FOLDER = os.path.join("static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif","webp"}

# ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join("static", "image"), exist_ok=True)

def allowed_image(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

def processImage(filename, operation):
    img = cv.imread(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    if img is None:
        return None

    if operation == "resize":
        try:
            height = int(request.form.get("height", 500))
            width = int(request.form.get("width", 500))
        except ValueError:
            return None

        imgProcessed = cv.resize(img, (width, height))
        output_dir = os.path.join("static", "image")
        output_path = os.path.join(output_dir, f"{operation}_{filename}")
        cv.imwrite(output_path, imgProcessed)
        return f"/static/image/{operation}_{filename}"
    
    if operation == "grayscale":
        imgProcessed = cv.cvtColor(img, cv.COLOR_BGR2GRAY)   
        output_dir = os.path.join("static", "image")
        output_path = os.path.join(output_dir, f"{operation}_{filename}")
        cv.imwrite(output_path, imgProcessed)
        return f"/static/image/{operation}_{filename}"

    return None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/edit", methods=["GET", "POST"])
def edit():
    if request.method == "POST":
        operation = request.form.get("operation")

        if "image" not in request.files:
            return "error: no image part"

        image = request.files["image"]
        if image.filename == "":
            return "error: no selected image"

        if image and allowed_image(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            edited_image = processImage(filename, operation)
            if edited_image:
                return render_template("index.html", edited_image=edited_image)
            else:
                return "error: processing failed"

        return "error: image type not allowed"

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
