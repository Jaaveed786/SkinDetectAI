t# 🚀 SkinDetect AI — 24/7 Deployment & Package Guide

This guide provides step-by-step instructions to push your code to GitHub, deploy it to a server for 24/7 operation, and understand the core package contents.

---

## 📂 1. Project Documentation Overview

Before deploying, familiarize yourself with these essential documentation files included in the root directory:

- **README.md**: The primary project hub. It contains the feature list, tech stack summary, one-click installation guide, and academic acknowledgments.
- **VIVA_GUIDE.md**: A dedicated "Viva Preparation" document. It contains technical questions and answers about FastAPI vs Django, ports, and AI logic to help you during your project defense.
- **project_report.md**: A structured academic report detailing the problem statement, methodology, and results of the SkinDetect AI platform.
- **setup_guide.html**: A visual, browser-ready guide for non-technical users to set up the system locally.

---

## 🛠️ 2. Essential Tools Required

To manage and deploy this project 24/7, you should have the following tools installed:

- **Visual Studio Code (VS Code)**: The recommended IDE for editing code and managing the project.
- **Python 3.11+**: Required to run the FastAPI backend engine locally.
- **Node.js 20+**: Required for the React/Vite frontend development server.
- **Docker Desktop**: Critical for 24/7 deployment. It packages the app into containers that run exactly the same on any server.
- **Git**: For version control and pushing your code to GitHub.
- **Postman / Swagger**: Use the built-in Swagger UI at `http://localhost:8000/docs` to test your API endpoints.

---

## 🏗️ 3. Core File Breakdown

Understanding these files is key to a successful deployment:

- **`backend/main.py`**: The "Brain" of the project. It handles all API requests, AI inference, and database interactions.
- **`web-app/src/`**: Contains the entire UI logic. Key pages include `UserDashboard.tsx` and `LandingPage.tsx`.
- **`docker-compose.yml`**: The "Execution Blueprint." It tells Docker how to stitch the frontend and backend together into a single 24/7 running system.
- **`run.bat`**: A Windows automation script for quick local startup without manual commands.

---

## 🟢 4. Step 1: Push Code to GitHub

1. **Configure Git Identity**:
   If this is your first time using Git on this computer, set your identity:
   ```bash
   git config --global user.email "mullajaaveed786@gmail.com"
   git config --global user.name "Jaaveed"
   ```

2. **Initialize Local Git**:
   Open a terminal in your project root (`c:\SkinDetectAI`) and run:

   ```bash
   git init
   git add .
   git commit -m "Initial commit — SkinDetect AI Full System"
   ```

3. **Connect to GitHub**:
   Run this command to link your code to your repository:

   ```bash
   git remote add origin https://github.com/Jaaveed786/SkinDetectAI.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌐 Step 2: Server Setup (VPS)

To run the app **24/7**, you need a Virtual Private Server (VPS) like DigitalOcean, AWS, or Google Cloud.

1. **Get a Server**: Create a "Droplet" (DigitalOcean) or "EC2 Instance" (AWS) with **Ubuntu 22.04 LTS**.
2. **Install Docker**: On your new server, run:

   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

---

## ⚡ Step 3: Deploy 24/7 with Docker

1. **Clone the Repo on Server**:

   ```bash
   git clone https://github.com/USERNAME/SkinDetectAI.git
   cd SkinDetectAI
   ```

2. **Configure Environment**:
   Create a `.env` file in the root if needed, or rely on the defaults in `docker-compose.yml`.
3. **Launch the System**:
   Run this command to build and start everything in **Background Mode**:

   ```bash
   sudo docker-compose up -d --build
   ```

   > [!TIP]
   > The `-d` flag stands for "Detached," meaning the app will keep running even if you close the terminal.

---

## 🛠️ Step 4: Maintenance & Logs

- **Check if running**: `sudo docker ps`
- **View Live Logs**: `sudo docker-compose logs -f`
- **Stop the App**: `sudo docker-compose down`
- **Update the App**:
  If you make changes on your local computer and push to GitHub:

  ```bash
  git pull origin main
  sudo docker-compose up -d --build
  ```

---

---

## 🌎 6. Global 24/7 Access (Vercel & Render)

If you want a link like `skindetect.vercel.app` that works on **any device, anywhere** without running `run.bat`, follow these steps.

### Phase 1: Deploy AI Engine (Render.com)
1. Sign in to [Render](https://render.com) using your GitHub account.
2. Select **New Web Service** and connect your `SkinDetectAI` repo.
3. **Settings**:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Instance Type**: Starter (or free, but note AI needs memory)
4. **Environment Variables**: Add your `JWT_SECRET_KEY` and any AI keys needed.
5. Copy your Render URL (e.g., `https://skindetect-backend.onrender.com`).

### Phase 2: Deploy Web App (Vercel.com)
1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Select **Add New Project** and import `SkinDetectAI`.
3. **Settings**:
   - **Root Directory**: `web-app`
   - **Framework Preset**: `Vite`
4. **Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: [Your Render URL from Phase 1]
5. Click **Deploy**.

---

> [!TIP]
> **Why this works**: Once deployed, your website lives on Vercel's global network, and your AI engine lives on Render. Both are available 24/7 and don't require your computer to be turned on!

---
