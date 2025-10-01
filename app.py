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
    
    if operation== "bw":
        img_gray= cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        imgProcessed = cv.threshold(img_gray, 127, 255, cv.THRESH_BINARY)[1]
        output_dir = os.path.join("static", "image")
        output_path = os.path.join(output_dir, f"{operation}_{filename}")
        cv.imwrite(output_path, imgProcessed)
        return f"/static/image/{operation}_{filename}"
    
    if operation== "rgb":
        try:
            channel=request.form.get("channel")
        except ValueError:
            return None

        B,G,R=cv.split(img)
        if channel=="BLUE":
            imgProcessed = B
            output_dir = os.path.join("static", "image")
            output_path = os.path.join(output_dir, f"{channel}_{filename}")
            cv.imwrite(output_path, imgProcessed)
            return f"/static/image/{channel}_{filename}"
        elif channel=="Green":
            imgProcessed = G
            output_dir = os.path.join("static", "image")
            output_path = os.path.join(output_dir, f"{channel}_{filename}")
            cv.imwrite(output_path, imgProcessed)
            return f"/static/image/{channel}_{filename}"
        else:
            imgProcessed = R
            output_dir = os.path.join("static", "image")
            output_path = os.path.join(output_dir, f"{channel}_{filename}")
            cv.imwrite(output_path, imgProcessed)
            return f"/static/image/{channel}_{filename}"

    if operation=="negative":
            img_gray= cv.cvtColor(img, cv.COLOR_BGR2GRAY)
            negative=1-img_gray
            imgProcessed = negative
            output_dir = os.path.join("static", "image")
            output_path = os.path.join(output_dir, f"{operation}_{filename}")
            cv.imwrite(output_path, imgProcessed)
            return f"/static/image/{operation}_{filename}"     

    if operation == "crop":
        try:
            height1 = int(request.form.get("height1",0))
            height2 = int(request.form.get("height2"))
            width1 = int(request.form.get("width1",0))
            width2 = int(request.form.get("width2"))
        except ValueError:
            return None

        imgProcessed = img[width1:width2,height1:height2]
        output_dir = os.path.join("static", "image")
        output_path = os.path.join(output_dir, f"{operation}_{filename}")
        cv.imwrite(output_path, imgProcessed)
        return f"/static/image/{operation}_{filename}"  

    if operation=="flip":
        try:
            flip=request.form.get("flip")
        except ValueError:
            return None
        
        flip_horizontal = cv.flip(img, 1)
        flip_vertical = cv.flip(img, 0)
        flip_both = cv.flip(img, -1) 

        if flip=="horizontal":
            imgProcessed = flip_horizontal
            output_dir = os.path.join("static", "image")
            output_path = os.path.join(output_dir, f"{operation}_{flip}_{filename}")
            cv.imwrite(output_path, imgProcessed)
            return f"/static/image/{operation}_{flip}_{filename}"
        elif flip=="vertical":
            imgProcessed = flip_vertical
            output_dir = os.path.join("static", "image")
            output_path = os.path.join(output_dir, f"{operation}_{flip}_{filename}")
            cv.imwrite(output_path, imgProcessed)
            return f"/static/image/{operation}_{flip}_{filename}"
        else:
            imgProcessed = flip_both
            output_dir = os.path.join("static", "image")
            output_path = os.path.join(output_dir, f"{operation}_{flip}_{filename}")
            cv.imwrite(output_path, imgProcessed)
            return f"/static/image/{operation}_{flip}_{filename}"


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
