from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Product as ProductModel
from app.schemas import Product


def verify_admin(x_api_key: str = Header(..., alias="X-API-Key")):
    if not settings.admin_api_key:
        raise HTTPException(status_code=503, detail="Admin API key is not configured")
    if x_api_key != settings.admin_api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")


def product_to_schema(row: ProductModel) -> Product:
    return Product(
        id=row.id,
        category=row.category,
        price=row.price,
        image=row.image,
        inStock=row.in_stock,
        popular=row.popular,
        weight=row.weight,
        names=row.names,
        descriptions=row.descriptions,
    )


def get_product_or_404(db: Session, product_id: str) -> ProductModel:
    row = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return row
