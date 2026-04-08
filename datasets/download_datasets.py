"""
SkinDetect.AI Dataset Downloader
Downloads HAM10000 & ISIC datasets via Kaggle API.

Usage:
  pip install kaggle
  # Place your kaggle.json in ~/.kaggle/kaggle.json
  python download_datasets.py
"""

import os, sys, zipfile, subprocess

DATASETS_DIR = os.path.dirname(os.path.abspath(__file__))

KAGGLE_DATASETS = [
    {
        "name":   "HAM10000 — 10,015 Dermatoscopic Images",
        "handle": "kmader/skin-lesion-analysis-toward-melanoma-detection",
        "folder": "ham10000",
    },
    {
        "name":   "ISIC 2019 Skin Lesion Classification",
        "handle": "andrewmvd/isic-2019",
        "folder": "isic2019",
    },
]

def check_kaggle():
    try:
        subprocess.run(["kaggle", "--version"], check=True, capture_output=True)
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        return False

def download(dataset: dict):
    dest = os.path.join(DATASETS_DIR, dataset["folder"])
    os.makedirs(dest, exist_ok=True)
    print(f"\n📥 Downloading: {dataset['name']}")
    print(f"   Handle : {dataset['handle']}")
    print(f"   Target : {dest}")
    cmd = ["kaggle", "datasets", "download", "-d", dataset["handle"],
           "-p", dest, "--unzip"]
    result = subprocess.run(cmd, capture_output=False)
    if result.returncode == 0:
        print(f"   ✅ Done → {dest}")
    else:
        print(f"   ❌ Failed — check your Kaggle API credentials.")

def create_readme():
    with open(os.path.join(DATASETS_DIR, "README.md"), "w") as f:
        f.write("""# SkinDetect.AI — Datasets

## Required Datasets

| Dataset | Source | Size |
|---------|--------|------|
| HAM10000 | [Kaggle](https://www.kaggle.com/datasets/kmader/skin-lesion-analysis-toward-melanoma-detection) | ~2.5 GB |
| ISIC 2019 | [Kaggle](https://www.kaggle.com/datasets/andrewmvd/isic-2019) | ~10 GB |

## How to Download

### 1. Install Kaggle CLI
```bash
pip install kaggle
```

### 2. Get API credentials
- Go to https://www.kaggle.com/settings
- Click **Create New Token** → downloads `kaggle.json`
- Place at `~/.kaggle/kaggle.json` (Linux/Mac) or `C:\\Users\\<user>\\.kaggle\\kaggle.json` (Windows)

### 3. Run the downloader
```bash
python download_datasets.py
```

## Dataset Classes (HAM10000 / HAM10000)

| Label | Class | Description |
|-------|-------|-------------|
| nv    | Melanocytic Nevi | Benign mole |
| mel   | Melanoma | Malignant skin cancer |
| bkl   | Benign Keratosis | Seborrheic keratosis |
| bcc   | Basal Cell Carcinoma | Common skin cancer |
| akiec | Actinic Keratosis | Pre-cancerous lesion |
| vasc  | Vascular Lesion | Blood vessel lesion |
| df    | Dermatofibroma | Benign fibrous tissue |

## References
- Tschandl et al., *Scientific Data* 2018 — https://www.nature.com/articles/sdata2018161
- ISIC Archive — https://www.isic-archive.com
""")
    print("📄 README.md created in datasets/")

if __name__ == "__main__":
    print("=" * 60)
    print("  SkinDetect.AI — Dataset Downloader")
    print("=" * 60)

    create_readme()

    if not check_kaggle():
        print("\n❌ Kaggle CLI not found. Install with: pip install kaggle")
        print("   Then set up credentials at: https://www.kaggle.com/settings")
        sys.exit(1)

    for ds in KAGGLE_DATASETS:
        download(ds)

    print("\n✅ All downloads complete!")
    print(f"   Datasets saved to: {DATASETS_DIR}")
    print("   Use ham10000/ and isic2019/ folders for model training.")
