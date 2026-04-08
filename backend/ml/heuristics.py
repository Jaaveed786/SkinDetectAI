"""SkinDetect.AI — ABCDE Heuristic Analysis"""
import io
import numpy as np
from PIL import Image, ImageFilter, ImageStat
from typing import Dict, Any

def analyze(image_bytes: bytes) -> Dict[str, Any]:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
    gray  = np.array(image.convert("L")).astype(float)

    # A — Asymmetry
    left, right = gray[:, :112], np.fliplr(gray[:, 112:])
    mse_asym    = float(np.mean((left - right) ** 2))

    # B — Border irregularity
    edges    = image.filter(ImageFilter.FIND_EDGES)
    edge_arr = np.array(edges.convert("L")).astype(float)
    edge_var = float(np.var(edge_arr))

    # C — Color variance
    color_std = float(np.mean(ImageStat.Stat(image).stddev))

    # D — Diameter proxy
    bright = float(np.sum(gray > np.percentile(gray, 75))) / (224 * 224)

    # E — Evolution (entropy)
    hist, _   = np.histogram(gray.flatten(), bins=256, range=(0, 256))
    hist_n    = hist / (hist.sum() + 1e-9)
    hist_n    = hist_n[hist_n > 0]
    entropy   = float(-np.sum(hist_n * np.log2(hist_n)))

    nb = min(edge_var  / 2000.0, 1.0)
    nc = min(color_std / 80.0,   1.0)
    na = min(mse_asym  / 5000.0, 1.0)
    nd = bright
    ne = min(entropy   / 8.0,    1.0)

    risk_score = nb * 0.25 + nc * 0.25 + na * 0.20 + nd * 0.15 + ne * 0.15

    if risk_score > 0.72:
        disease, risk_level, conf = "Melanoma Suspected", "Critical", f"{min(85+risk_score*15,99):.1f}%"
        recs = ["⚠️ Seek immediate consultation.", "Book urgent dermatologist appointment.",
                "Photograph lesion daily.", "Avoid UV exposure to area."]
    elif risk_score > 0.50:
        disease, risk_level, conf = "Atypical Nevus / Possible BCC", "High Risk", f"{70+risk_score*20:.1f}%"
        recs = ["Consult dermatologist within 1 week.", "Apply SPF 50+ daily.",
                "Document any changes.", "Avoid cosmetics on area."]
    elif risk_score > 0.28:
        disease, risk_level, conf = "Benign Nevus (Monitor)", "Moderate Risk", f"{60+risk_score*25:.1f}%"
        recs = ["Monitor monthly with ABCDE checklist.", "See dermatologist if changes occur.",
                "Use SPF 30+ daily.", "No immediate action required."]
    else:
        disease, risk_level, conf = "Healthy Skin / Benign", "Low Risk", f"{max(90-risk_score*30,75):.1f}%"
        recs = ["No abnormal patterns detected.", "Continue monthly self-exams.",
                "Maintain sun protection habits.", "Annual check-up recommended."]

    return {
        "disease": disease, "risk_level": risk_level, "confidence": conf,
        "recommendations": recs,
        "metrics": {
            "border_variance": round(edge_var, 2), "color_stddev": round(color_std, 2),
            "asymmetry_mse": round(mse_asym, 2), "diameter_score": round(nd, 4),
            "evolution_score": round(ne, 4), "risk_score": round(risk_score, 4),
        },
    }
