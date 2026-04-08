# 🎓 SkinDetect AI — Technical Viva Preparation Guide

This guide explains the technical architecture, design decisions, and core logic of the SkinDetect AI platform to help you succeed in your project viva.

---

## 🏗️ 1. Architecture Overview (The "Big Picture")

The project follows a **Client-Server Architecture**:

- **Frontend (Client)**: Built with **React** (using **Vite**). It handles the User Interface, image uploads, and results visualization.
- **Backend (Server)**: Built with **FastAPI** (Python). It handles the AI logic, database storage (records), and image processing.
- **AI Engine**: A deep learning model (**EfficientNet-B7**) that analyzes images.
- **Explainable AI (XAI)**: Uses **Grad-CAM** to highlight *why* the AI made a certain decision.

---

## ⚡ 2. Why FastAPI (and why not Django)?

### Viva Question: "Why did you choose FastAPI over Django for the backend?"

| Feature | FastAPI (Our Choice) | Django |
| :--- | :--- | :--- |
| **Performance** | Extremely fast (built on Starlette/Uvicorn). | Slower due to "heavy" middleware. |
| **Async Support** | Native `async/await`. Perfect for AI tasks. | Synchronous by nature (older design). |
| **Complexity** | Lean and modular. You only add what you need. | "Batteries included" (very heavy). |
| **Documentation** | Auto-generates Swagger/OpenAPI docs. | Requires extra plugins like DRF. |

**Answer**: "We chose FastAPI because it is modern, high-performance, and supports asynchronous image processing. This allows our AI model to analyze images without blocking other user requests. Django is great for standard websites, but too heavy for an AI microservice."

---

## 🌐 3. Ports & Localhost Logic

### Viva Question: "What are the roles of ports 8000 and 5173?"

1. **Localhost:5173 (Frontend)**:
   - This is where the **React** application runs during development.
   - It is managed by **Vite**, a modern build tool that allows for "Hot Module Replacement" (instant UI updates).
2. **Localhost:8000 (Backend)**:
   - This is where the **FastAPI** server runs.
   - All AI analysis and database saving happens here.
3. **Communication**:
   - When you click "Analyze," the Frontend (5173) sends an `HTTP POST` request to the Backend (8000).
   - The Backend processes the image and sends back a JSON response.

---

## 🧠 4. The AI Workflow (Step-by-Step)

### Viva Question: "Explain what happens when an image is uploaded."

1. **Upload**: User selects a skin image in the React UI.
2. **API Call**: The image is sent to the `/analyze` endpoint in FastAPI.
3. **Preprocessing**: The image is resized to `600x600` (standard for EfficientNet) and normalized.
4. **Inference**: The **EfficientNet-B7** model (pre-trained on skin cancer datasets) generates probabilities for 7 classes (e.g., Melanoma, Nevi).
5. **Grad-CAM Generation**: The code looks at the last convolutional layer of the model to see which pixels "fired" the most. It creates a heatmap overlay.
6. **Result**: The UI displays the diagnosis percentage and the heatmap so doctors can verify the lesion area.

---

## 🔐 5. Security & Authentication

### Viva Question: "How are users authenticated?"

- We use **JWT (JSON Web Tokens)**.
- When a user logs in, the server signs a token.
- The browser saves this token in `localStorage`.
- Every "locked" request (like saving a scan) includes this token in the header to prove the user's identity.

---

## 🐳 6. Why Docker?

### Viva Question: "Why did you use Docker for deployment?"

- **Portability**: "It works on my machine" becomes "It works on every machine."
- **Isolation**: No need to manually install Python or Node.js on the server.
- **24/7 Running**: Docker Compose has a `restart: always` policy. If the server crashes, Docker automatically revives the AI engine.

---

## 📝 7. Code Logic Walkthrough (Line-by-Line Logic)

### Backend (`backend/main.py`)

- **`@app.post("/upload")`**: This is the main bridge. It accepts an `UploadFile` and returns a JSON dictionary of results.
- **`preprocess_image()`**: Converts the raw image to a NumPy array. AI models cannot read files; they only read numbers (tensors).
- **`analyze_abcde_heuristics()`**: A fallback mathematical algorithm that checks for Asymmetry, Border inconsistency, Color variation, and Diameter.

### Frontend (`web-app/src/components/DiagnosticMCQForm.tsx`)

- **`useState`**: Keeps track of which question the user is currently on (0 to 7).
- **`handleAnswer`**: Saves the user's choice and increments the step.
- **`AnimatePresence`**: Ensures that as one question disappears, the next one slides in smoothly without a jarring jump.

---

## 💡 Quick Vocabulary for Viva

- **Heuristics**: Rule-based logic (like the ABCDE checklist).
- **Inference**: The act of an AI model making a prediction.
- **Normalization**: Scaling pixel values between 0 and 1 for better math accuracy.
- **Middleware**: Code that runs before a request reaches the main logic (e.g., CORS).
