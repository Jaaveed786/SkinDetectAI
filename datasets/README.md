# SkinDetect.AI — Datasets

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
- Place at `~/.kaggle/kaggle.json` (Linux/Mac) or `C:\Users\<user>\.kaggle\kaggle.json` (Windows)

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
