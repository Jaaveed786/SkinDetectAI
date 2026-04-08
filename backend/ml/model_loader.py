"""SkinDetect.AI — ML Model Loader"""
import os
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "efficientnet_b7.h5")
CLASSES = [
    "Melanocytic Nevi", "Melanoma", "Benign Keratosis-like Lesion",
    "Basal Cell Carcinoma", "Actinic Keratosis / Bowen's Disease",
    "Vascular Lesion", "Dermatofibroma"
]

model = None
TF_MODEL_LOADED = False

def load_model():
    global model, TF_MODEL_LOADED
    try:
        import tensorflow as tf
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            TF_MODEL_LOADED = True
            print(f"✅ EfficientNet-B7 loaded from {MODEL_PATH}")
        else:
            print(f"⚠️  Model not found at {MODEL_PATH} — using ABCDE heuristic fallback")
    except ImportError:
        print("⚠️  TensorFlow not installed")

def predict(image_array: np.ndarray) -> dict:
    if model is None or not TF_MODEL_LOADED:
        return None
    preds = model.predict(image_array, verbose=0)
    idx   = int(np.argmax(preds[0]))
    return {"class": CLASSES[idx], "confidence": float(preds[0][idx]), "index": idx}
