# HARAL — Railway single service (FastAPI + static PWA)
# Builds haral-shop (Next static export) and serves from FastAPI.

FROM node:22-alpine AS frontend-build
WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=1536

COPY haral-shop/package.json haral-shop/package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund
COPY haral-shop/ ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
COPY --from=frontend-build /app/out ./static

EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
