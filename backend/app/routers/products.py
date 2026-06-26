from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_product_or_404, product_to_schema, verify_admin
from app.models import Product as ProductModel
from app.schemas import Product, ProductCreate, ProductListResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


def _query_products(
    db: Session,
    category: Optional[str],
    q: Optional[str],
    sort: Optional[str],
    popular: Optional[bool],
):
    query = db.query(ProductModel)

    if category and category != "all":
        query = query.filter(ProductModel.category == category)

    if popular:
        query = query.filter(ProductModel.popular.is_(True))

    rows = query.all()

    if q:
        query_lower = q.lower()
        rows = [
            r
            for r in rows
            if query_lower in r.id.lower()
            or any(query_lower in name.lower() for name in r.names.values())
        ]

    if sort == "price-low":
        rows = sorted(rows, key=lambda r: r.price)
    elif sort == "price-high":
        rows = sorted(rows, key=lambda r: r.price, reverse=True)
    else:
        rows = sorted(rows, key=lambda r: (not r.popular, r.id))

    return rows


@router.get("", response_model=ProductListResponse)
def list_products(
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    popular: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    rows = _query_products(db, category, q, sort, popular)
    items = [product_to_schema(r) for r in rows]
    return ProductListResponse(items=items, total=len(items))


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str, db: Session = Depends(get_db)):
    row = get_product_or_404(db, product_id)
    return product_to_schema(row)


@router.post("", response_model=Product, dependencies=[Depends(verify_admin)])
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    if db.query(ProductModel).filter(ProductModel.id == payload.id).first():
        raise HTTPException(status_code=409, detail="Product already exists")

    row = ProductModel(
        id=payload.id,
        category=payload.category,
        price=payload.price,
        image=payload.image,
        in_stock=payload.inStock,
        popular=payload.popular,
        weight=payload.weight,
        names=payload.names.model_dump(),
        descriptions=payload.descriptions.model_dump(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return product_to_schema(row)


@router.patch("/{product_id}", response_model=Product, dependencies=[Depends(verify_admin)])
def update_product(
    product_id: str,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
):
    row = get_product_or_404(db, product_id)
    data = payload.model_dump(exclude_unset=True)

    field_map = {
        "inStock": "in_stock",
        "image": "image",
        "price": "price",
        "category": "category",
        "popular": "popular",
        "weight": "weight",
    }

    for key, value in data.items():
        if key in ("names", "descriptions") and value is not None:
            setattr(row, key, value)
        elif key in field_map:
            setattr(row, field_map[key], value)

    db.commit()
    db.refresh(row)
    return product_to_schema(row)
