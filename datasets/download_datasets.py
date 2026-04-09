"""
SkinDetect.AI - Dataset Downloader
====================================
Downloads HAM10000 & ISIC 2019 datasets via Kaggle API.

Usage:
  pip install kaggle
  # Place your kaggle.json in C:\\Users\\<user>\\.kaggle\\kaggle.json
  python download_datasets.py
"""

import os, sys, subprocess, shutil

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

def find_kaggle():
    """Find the kaggle executable on the system."""
    # Try shutil.which first (works cross-platform)
    kaggle = shutil.which("kaggle")
    if kaggle:
        return kaggle

    # Windows fallback locations
    candidates = [
        os.path.expandvars(r"%APPDATA%\Python\Scripts\kaggle.exe"),
        os.path.expanduser(r"~\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\LocalCache\local-packages\Python311\Scripts\kaggle.exe"),
        os.path.expanduser(r"~\AppData\Local\Programs\Python\Python311\Scripts\kaggle.exe"),
        os.path.expanduser(r"~\AppData\Roaming\Python\Python311\Scripts\kaggle.exe"),
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c

    return None

def check_credentials():
    """Check that kaggle.json exists."""
    cred = os.path.join(os.path.expanduser("~"), ".kaggle", "kaggle.json")
    if not os.path.isfile(cred):
        print(f"❌ Kaggle credentials not found at: {cred}")
        print("   Visit https://www.kaggle.com/settings → 'Create New API Token'")
        return False
    return True

def download(kaggle_exe: str, dataset: dict):
    dest = os.path.join(DATASETS_DIR, dataset["folder"])
    os.makedirs(dest, exist_ok=True)

    print(f"\n[DOWNLOAD] {dataset['name']}")
    print(f"   Handle : {dataset['handle']}")
    print(f"   Target : {dest}")

    cmd = [kaggle_exe, "datasets", "download",
           "-d", dataset["handle"],
           "-p", dest,
           "--unzip"]

    result = subprocess.run(cmd)
    if result.returncode == 0:
        print(f"   [OK] Done -> {dest}")
    else:
        print(f"   [FAIL] Failed -- check your Kaggle credentials and internet connection.")
        return False
    return True

def create_readme():
    readme_path = os.path.join(DATASETS_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8", errors="replace") as f:
        f.write("""# SkinDetect.AI — Datasets

> **Note:** Dataset images are NOT stored in GitHub (too large).
> Follow the steps below to download them locally.

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
- Place at `C:\\Users\\<YourName>\\.kaggle\\kaggle.json` (Windows)
- Or `~/.kaggle/kaggle.json` (Linux/Mac)

### 3. Run the downloader
```bash
python datasets/download_datasets.py
```

## Local Directory Structure (after download)

```
datasets/
├── ham10000/
│   ├── HAM10000_images_part_1/   (5,000 images)
│   ├── HAM10000_images_part_2/   (5,015 images)
│   └── HAM10000_metadata.csv
├── isic2019/
│   ├── ISIC_2019_Training_Input/
│   └── ISIC_2019_Training_GroundTruth.csv
├── download_datasets.py
└── README.md
```

## Dataset Classes

| Label | Class | Description |
|-------|-------|-------------|
| nv    | Melanocytic Nevi | Benign mole |
| mel   | Melanoma | Malignant skin cancer ★ |
| bkl   | Benign Keratosis | Seborrheic keratosis |
| bcc   | Basal Cell Carcinoma | Common skin cancer |
| akiec | Actinic Keratosis | Pre-cancerous lesion |
| vasc  | Vascular Lesion | Blood vessel lesion |
| df    | Dermatofibroma | Benign fibrous tissue |

## References
- Tschandl et al., *Scientific Data* 2018 — https://www.nature.com/articles/sdata2018161
- ISIC Archive — https://www.isic-archive.com
""")
    print("[OK] README.md updated in datasets/")

if __name__ == "__main__":
    print("=" * 60)
    print("  SkinDetect.AI — Dataset Downloader")
    print("=" * 60)

    create_readme()

    kaggle_exe = find_kaggle()
    if not kaggle_exe:
        print("\n[FAIL] Kaggle CLI not found. Install with:")
        print("   pip install kaggle")
        print("   Then restart your terminal.")
        sys.exit(1)

    print(f"\n[OK] Found Kaggle at: {kaggle_exe}")

    if not check_credentials():
        sys.exit(1)

    print("\n[OK] Kaggle credentials found.")
    print(f"   Saving all datasets to: {DATASETS_DIR}\n")

    all_ok = True
    for ds in KAGGLE_DATASETS:
        ok = download(kaggle_exe, ds)
        if not ok:
            all_ok = False

    print("\n" + "=" * 60)
    if all_ok:
        print("[SUCCESS] All downloads complete!")
        print(f"   Datasets saved to: {DATASETS_DIR}")
        print("   Folders: ham10000/  and  isic2019/")
    else:
        print("[WARNING] Some downloads failed. Check errors above.")
    print("=" * 60)
