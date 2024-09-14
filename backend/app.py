import os
import openai
import cv2  # For image processing (OpenCV)
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from PIL import Image  # For handling images
import numpy as np

load_dotenv()

app = Flask(__name__)
apikey = os.environ.get('OPENAI_KEY')
openai.api_key = apikey

# Load the pre-trained face and eye detection Haar Cascade models
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

# Function to resize image while maintaining the aspect ratio
def resize_image(image, max_width, max_height):
    h, w = image.shape[:2]
    aspect_ratio = w / h
    if w > max_width or h > max_height:
        if aspect_ratio > 1:
            new_w = max_width
            new_h = int(max_width / aspect_ratio)
        else:
            new_h = max_height
            new_w = int(max_height * aspect_ratio)
        return cv2.resize(image, (new_w, new_h))
    return image

# Route to generate expression using OpenAI
@app.route('/generate-expression', methods=['POST'])
def generate_expression():
    file = request.files['file']
    expression = request.form.get('expression')

    # Save the uploaded image temporarily
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    # Load the image using OpenCV
    img = cv2.imread(file_path)
    
    # Resize the uploaded image to speed up processing (e.g., max width 500px, max height 500px)
    img = resize_image(img, max_width=500, max_height=500)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Convert to grayscale for detection

    # Detect the face in the image
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # If a face is detected, detect its features (eyes, etc.)
    feature_description = ""
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Draw rectangle around the face
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = img[y:y + h, x:x + w]

        # Detect eyes within the detected face
        eyes = eye_cascade.detectMultiScale(roi_gray)
        if len(eyes) > 0:
            feature_description += f"The character has {len(eyes)} visible eyes. "
            for (ex, ey, ew, eh) in eyes:
                cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
        else:
            feature_description += "The character's eyes are not visible. "

    # If no face is detected, create a generic description
    if len(faces) == 0:
        feature_description = "The character has no detectable facial features."

    # Construct the description based on the input image's detected features and the requested expression
    character_description = f"A 2D cartoon character with the following features: {feature_description}"
    prompt = f"{character_description} with a {expression} facial expression."

    # Call OpenAI to generate the image based on the prompt, with reduced size
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="512x512"  # Reduced size for generated image
    )

    image_url = response['data'][0]['url']

    # Cleanup: Optionally delete the temporary uploaded file after use
    os.remove(file_path)

    return jsonify({'imageUrl': image_url})

if __name__ == '__main__':
    if not os.path.exists("uploads"):
        os.makedirs("uploads")  # Create uploads folder if it doesn't exist
    app.run(host='0.0.0.0', port=8000)
