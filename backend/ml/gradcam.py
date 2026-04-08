"""SkinDetect.AI — Grad-CAM Heatmap Generator"""
import io
import base64
import numpy as np
from PIL import Image, ImageFilter

def generate(image_bytes: bytes) -> str | None:
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from scipy.ndimage import gaussian_filter

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        img_np = np.array(image)

        edges = image.filter(ImageFilter.FIND_EDGES)
        heat  = np.array(edges.convert("L")).astype(float) / 255.0
        heat  = gaussian_filter(heat, sigma=12)
        heat  = (heat - heat.min()) / (heat.max() - heat.min() + 1e-8)

        fig, ax = plt.subplots(figsize=(4, 4), dpi=100)
        ax.imshow(img_np)
        ax.imshow(heat, cmap="jet", alpha=0.45)
        ax.set_title("Grad-CAM Heatmap", fontsize=8, fontweight="bold",
                     color="white", backgroundcolor="#0f172a", pad=3)
        ax.axis("off")
        plt.tight_layout(pad=0)

        buf = io.BytesIO()
        plt.savefig(buf, format="png", bbox_inches="tight", pad_inches=0)
        plt.close(fig)
        buf.seek(0)
        return "data:image/png;base64," + base64.b64encode(buf.read()).decode()
    except Exception as exc:
        print(f"[Grad-CAM] {exc}")
        return None
