import uuid
from typing import Optional

import boto3
from botocore.config import Config
from fastapi import HTTPException, UploadFile

from app.config import settings

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def _client():
    if not settings.r2_configured:
        raise HTTPException(status_code=503, detail="R2 storage is not configured")
    return boto3.client(
        "s3",
        endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


def build_public_url(key: str) -> str:
    base = settings.r2_public_base_url.rstrip("/")
    return f"{base}/{key}"


async def upload_image(file: UploadFile, folder: str = "products") -> dict:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    data = await file.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    ext = ALLOWED_CONTENT_TYPES[file.content_type]
    key = f"{folder}/{uuid.uuid4().hex}.{ext}"

    client = _client()
    client.put_object(
        Bucket=settings.r2_bucket_name,
        Key=key,
        Body=data,
        ContentType=file.content_type,
        CacheControl="public, max-age=31536000",
    )

    return {"key": key, "url": build_public_url(key)}


def delete_object(key: Optional[str]) -> None:
    if not key or not settings.r2_configured:
        return
    client = _client()
    client.delete_object(Bucket=settings.r2_bucket_name, Key=key)
