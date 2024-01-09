from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
from downscale import downscale
from upscale import upscale
import numpy as np
import cv2

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def process_image(image, scale):
    
    if scale == '1/3':
        scale = 3
        img = downscale(image, scale)
    elif scale == '1/2':
        scale = 2
        img = downscale(image, scale)
    elif scale == '1':
        return image
    elif scale == '2':
        scale = 2
        img = upscale(image, scale)
    elif scale == '3':
        scale = 3
        img = upscale(image, scale)

    img_pil = Image.fromarray(img)

    # Save PIL Image to byte array
    img_byte_array = BytesIO()
    img_pil.save(img_byte_array, format='PNG')
    img_byte_array.seek(0)
    return img_byte_array

@app.post("/upload")
async def upload(file: UploadFile = File(...), scale: str = Form(...)):
    if not file:
        return {"error": "No file uploaded"}
    print(scale)
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_cv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
    processed_image = process_image(img_cv, scale)
    
    
    return StreamingResponse(processed_image, media_type="image/png")
