"""SkinDetect.AI — Image Preprocessing Pipeline"""
import io
import numpy as np
from PIL import Image

TARGET_SIZE = (224, 224)

def preprocess(image_bytes: bytes) -> np.ndarray:
    """Resize, normalize, and expand dims for model input."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(TARGET_SIZE, Image.LANCZOS)
    arr   = np.array(image, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def to_pil(image_bytes: bytes, size=TARGET_SIZE) -> Image.Image:
    return Image.open(io.BytesIO(image_bytes)).convert("RGB").resize(size)
