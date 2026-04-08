FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (exclude tensorflow for smaller image)
COPY requirements.txt .
RUN pip install --no-cache-dir fastapi uvicorn[standard] pydantic python-multipart \
    python-dotenv httpx aiofiles python-jose[cryptography] passlib[bcrypt] \
    Pillow numpy opencv-python-headless matplotlib scipy scikit-learn \
    reportlab motor pymongo redis loguru

# Copy application
COPY . .

# Create ML directory
RUN mkdir -p ml

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
