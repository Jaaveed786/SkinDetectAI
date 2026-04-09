"""
SkinDetect.AI - Dataset Downloader
====================================
Downloads HAM10000 & ISIC 2019 datasets via kagglehub (Kaggle's new API).

BEFORE RUNNING:
  1. Go to https://www.kaggle.com/settings -> Create New API Token -> download kaggle.json
  2. Place kaggle.json at: C:\\Users\\<YourName>\\.kaggle\\kaggle.json
  3. Accept dataset rules on Kaggle (sign in and click Download on each dataset page):
     - https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000
     - https://www.kaggle.com/datasets/andrewmvd/isic-2019
  4. pip install kagglehub
  5. python download_datasets.py
"""

import os
import sys
import shutil
import subprocess

DATASETS_DIR = os.path.dirname(os.path.abspath(__file__))

DATASETS = [
    {
        "name":   "HAM10000 - Skin Cancer MNIST",
        "handle": "kmader/skin-cancer-mnist-ham10000",
        "folder": "ham10000",
    },
    {
        "name":   "ISIC 2019 Skin Lesion Classification",
        "handle": "andrewmvd/isic-2019",
        "folder": "isic2019",
    },
]


def check_kaggle_json():
    """Verify kaggle.json exists and has required fields."""
    import json
    cred_path = os.path.join(os.path.expanduser("~"), ".kaggle", "kaggle.json")
    if not os.path.isfile(cred_path):
        print(f"\n[ERROR] kaggle.json not found at: {cred_path}")
        print("  1. Go to https://www.kaggle.com/settings")
        print("  2. Click 'Create New API Token'")
        print(f"  3. Move the downloaded kaggle.json to: {cred_path}")
        return False
    try:
        with open(cred_path) as f:
            data = json.load(f)
        if "username" not in data or "key" not in data:
            print("[ERROR] kaggle.json is missing 'username' or 'key' fields.")
            print("  Re-download it from https://www.kaggle.com/settings")
            return False
        print(f"[OK] Kaggle credentials found for user: {data['username']}")
        return True
    except Exception as e:
        print(f"[ERROR] Could not read kaggle.json: {e}")
        return False


def install_kagglehub():
    """Install kagglehub if not already installed."""
    try:
        import kagglehub
        print("[OK] kagglehub is already installed.")
        return True
    except ImportError:
        print("[INFO] Installing kagglehub...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "kagglehub", "-q"],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            print("[OK] kagglehub installed.")
            return True
        else:
            print(f"[ERROR] Failed to install kagglehub:\n{result.stderr}")
            return False


def download_dataset(dataset: dict) -> bool:
    """Download a dataset using kagglehub."""
    import kagglehub

    dest = os.path.join(DATASETS_DIR, dataset["folder"])
    os.makedirs(dest, exist_ok=True)

    print(f"\n{'='*55}")
    print(f"[DOWNLOAD] {dataset['name']}")
    print(f"  Handle : {dataset['handle']}")
    print(f"  Target : {dest}")
    print(f"{'='*55}")

    try:
        # kagglehub downloads to a cache dir; we copy to our target
        path = kagglehub.dataset_download(dataset["handle"])
        print(f"[OK] Downloaded to cache: {path}")

        # Copy files to our datasets folder
        if os.path.isdir(path):
            for item in os.listdir(path):
                src = os.path.join(path, item)
                dst = os.path.join(dest, item)
                if os.path.isdir(src):
                    if os.path.exists(dst):
                        shutil.rmtree(dst)
                    shutil.copytree(src, dst)
                else:
                    shutil.copy2(src, dst)
            print(f"[OK] Copied to: {dest}")
        else:
            shutil.copy2(path, dest)
            print(f"[OK] Copied to: {dest}")

        return True

    except Exception as e:
        err = str(e)
        print(f"\n[FAIL] Download failed: {err}")
        if "403" in err or "Forbidden" in err:
            print("\n  >>> ACTION REQUIRED <<<")
            print(f"  You must accept the dataset rules on Kaggle before API download works.")
            print(f"  1. Sign in at https://www.kaggle.com")
            print(f"  2. Visit: https://www.kaggle.com/datasets/{dataset['handle']}")
            print(f"  3. Click the [Download] button and accept any terms/rules")
            print(f"  4. Then re-run this script.")
        elif "401" in err or "Unauthorized" in err:
            print("\n  >>> ACTION REQUIRED <<<")
            print("  Your Kaggle API token is invalid or expired.")
            print("  1. Go to https://www.kaggle.com/settings")
            print("  2. Delete old token, create a new one")
            print("  3. Replace ~/.kaggle/kaggle.json with the new token")
        return False


def update_readme():
    readme_path = os.path.join(DATASETS_DIR, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write("""# SkinDetect.AI - Datasets

> **Note:** Dataset images are NOT stored in GitHub (files are too large).
> Download them locally using the steps below.

## Required Datasets

| Dataset | Kaggle Handle | Size |
|---------|--------------|------|
| HAM10000 | [kmader/skin-cancer-mnist-ham10000](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000) | ~3 GB |
| ISIC 2019 | [andrewmvd/isic-2019](https://www.kaggle.com/datasets/andrewmvd/isic-2019) | ~10 GB |

## Download Instructions

### Step 1: Install kagglehub
```bash
pip install kagglehub
```

### Step 2: Set up Kaggle API credentials
- Go to https://www.kaggle.com/settings
- Click **Create New Token** -> downloads `kaggle.json`
- Place at `C:\\Users\\<YourName>\\.kaggle\\kaggle.json` (Windows)

### Step 3: Accept dataset rules on Kaggle (REQUIRED)
Sign in to Kaggle and click Download on each dataset page:
- https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000
- https://www.kaggle.com/datasets/andrewmvd/isic-2019

### Step 4: Run the downloader
```bash
python datasets/download_datasets.py
```

## Local Directory Structure (after download)

```
datasets/
├── ham10000/
│   ├── HAM10000_images_part_1/   # ~5,000 dermoscopy images
│   ├── HAM10000_images_part_2/   # ~5,015 dermoscopy images
│   └── HAM10000_metadata.csv
├── isic2019/
│   ├── ISIC_2019_Training_Input/ # ~25,000 images
│   └── ISIC_2019_Training_GroundTruth.csv
├── download_datasets.py
└── README.md
```

## Dataset Classes

| Label | Class | Description |
|-------|-------|-------------|
| nv | Melanocytic Nevi | Benign mole |
| mel | Melanoma | Malignant skin cancer |
| bkl | Benign Keratosis | Seborrheic keratosis |
| bcc | Basal Cell Carcinoma | Common skin cancer |
| akiec | Actinic Keratosis | Pre-cancerous lesion |
| vasc | Vascular Lesion | Blood vessel lesion |
| df | Dermatofibroma | Benign fibrous tissue |

## References
- Tschandl et al., *Scientific Data* 2018 - https://www.nature.com/articles/sdata2018161
- ISIC Archive - https://www.isic-archive.com
""")
    print("[OK] datasets/README.md updated.")


if __name__ == "__main__":
    print("=" * 55)
    print("  SkinDetect.AI - Dataset Downloader")
    print("=" * 55)

    update_readme()

    if not check_kaggle_json():
        sys.exit(1)

    if not install_kagglehub():
        sys.exit(1)

    print(f"\n[INFO] Datasets will be saved to: {DATASETS_DIR}\n")

    results = {}
    for ds in DATASETS:
        results[ds["name"]] = download_dataset(ds)

    print("\n" + "=" * 55)
    print("  Download Summary")
    print("=" * 55)
    for name, ok in results.items():
        status = "[SUCCESS]" if ok else "[FAILED] "
        print(f"  {status} {name}")

    if all(results.values()):
        print("\n[ALL DONE] Datasets ready in:")
        print(f"  {DATASETS_DIR}")
    else:
        print("\n[ACTION NEEDED] Some downloads failed — see instructions above.")
    print("=" * 55)
