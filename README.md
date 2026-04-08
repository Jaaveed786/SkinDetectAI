# 🔬 SkinDetect.AI — Smart Dermatology Platform

> **AI-Powered system for Multi-Label Skin Cancer Detection & Management System**

[![Live Demo](https://img.shields.io/badge/Live-WebAPP-teal?style=for-the-badge&logo=react)](https://jaaveed786.github.io/SkinDetectAI/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-slate?style=for-the-badge&logo=github)](https://github.com/Jaaveed786/SkinDetectAI)

SkinDetect.AI is a comprehensive teledermatology platform designed to democratize clinical-level AI skin analysis. Utilizing an **EfficientNet-B7** deep learning architecture combined with a deterministic **ABCDE heuristic engine**, it provides instant, explainable diagnostics for common dermatological conditions.

---

## ✨ Features

- **Dual AI Engine:** Combines Deep Learning (TensorFlow) with deterministic ABCDE heuristics for robustness.
- **Explainable AI (XAI):** Integrated **Grad-CAM heatmaps** to visualize precise detection zones.
- **Medical AI Chatbot:** Powered by **OpenAI**, providing 24/7 dermatological triage and advice.
- **Mandatory Diagnosis Flow:** Enforces a mandatory **8-question symptom questionnaire** for every scan.
- **Secure Dashboard:** Family health tracker with full scan history and patient demographics.
- **Medical Reports:** Instant generation of encrypted **PDF medical reports** with AI insights.
- **Admin Portal:** Unified management system for user monitoring and system statistics.
- **Multi-Lingual:** Support for 7 languages (English + major Indian languages).

---

## 🛠️ Tech Stack

- **Backend:** FastAPI (Python 3.9+), SQLite3, TensorFlow/Keras.
- **Frontend:** React 18 (Vite), TailwindCSS, Framer Motion.
- **Authentication:** JWT (JSON Web Tokens) with PBKDF2 Password Hashing.
- **Documentation:** Markdown, Mermaid Diagrams.

---

## 📂 Project Structure

```text
SkinDetectAI/
├── backend/                # FastAPI Application
│   ├── ml/                 # AI Model Weights (.h5)
│   ├── main.py             # Server Core & API Routes
│   └── requirements.txt    # Backend-only dependencies
├── web-app/                # React Vite Application
│   ├── src/                # Components, Pages, Contexts
│   └── .env.example        # Frontend environment template
├── run.bat                 # ONE-CLICK Windows Launcher
├── requirements.txt        # Root consolidated dependencies
└── README.md               # Extensive Project Documentation
```

---

## 🚀 Quick Start (Windows)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Jaaveed786/SkinDetectAI.git
   cd SkinDetectAI
   ```

2. **Configure Environment:**

   - Copy `web-app/.env.example` to `web-app/.env`
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your API keys (optional for local diagnostic tests but required for full features).

3. **One-Click Run:**

   - Double-click `run.bat` to automatically install dependencies and launch both servers.

---

## 🔑 Environment Variables & API Guide

The system is configured to integrate with several third-party services. Configure these in your `.env` files:

### Backend (.env)

- `JWT_SECRET_KEY`: Security salt for tokens.
- `AWS_ACCESS_KEY_ID` / `SECRET_KEY`: For S3 medical asset storage.
- `CLOUDINARY_API_KEY`: For fast CDN image delivery.
- `SENDGRID_API_KEY`: For automated patient email results.
- `TWILIO_ACCOUNT_SID`: For SMS alerts and 2FA.

### Frontend (.env)

- `VITE_API_BASE_URL`: Pointer to your FastAPI backend (default: `http://localhost:8000`).
- `VITE_GOOGLE_MAPS_API_KEY`: For locating the nearest dermatologists.
- `VITE_STRIPE_PUBLISHABLE_KEY`: For integrated appointment bookings.

---

## 👤 Default Credentials

- **Admin Portal:** `admin@skindetect.ai` / `Admin@1234`
- **User Portal:** Create a new account via the Register page.

---

## 📜 Academic Acknowledgments

This project was developed by:

- **Project Lead:** M. Jaaveed (229F1A3235)
- **Frontend/App:** B. Manoj kumar Reddy (229F1A3211)
- **AI/ML Engine:** N. Krishna Sai (229F1A3239)
- **Backend/API:** S. Raghu (229F1A3249)
- **Database/Cloud:** S. M. Kiran (229F1A3246)
- **Guide:** Mrs. B. Sirisha (MTech, SVIT)
