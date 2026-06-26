from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_product_or_404, product_to_schema, verify_admin
from app.schemas import Product, UploadResponse
from app.services.r2 import delete_object, upload_image

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/image", response_model=UploadResponse, dependencies=[Depends(verify_admin)])
async def upload_image_file(
    file: UploadFile = File(...),
    folder: str = "products",
):
    result = await upload_image(file, folder=folder)
    return UploadResponse(url=result["url"], key=result["key"])


@router.post("/products/{product_id}/image", response_model=Product, dependencies=[Depends(verify_admin)])
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    row = get_product_or_404(db, product_id)
    result = await upload_image(file, folder="products")

    if row.image_key:
        delete_object(row.image_key)

    row.image = result["url"]
    row.image_key = result["key"]
    db.commit()
    db.refresh(row)
    return product_to_schema(row)
