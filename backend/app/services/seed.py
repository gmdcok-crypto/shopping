import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.models import Product

SEED_PATH = Path(__file__).resolve().parent.parent / "data" / "products.json"


def seed_products(db: Session) -> int:
    if db.query(Product).count() > 0:
        return 0

    if not SEED_PATH.exists():
        return 0

    with open(SEED_PATH, encoding="utf-8") as f:
        items = json.load(f)

    for item in items:
        db.add(
            Product(
                id=item["id"],
                category=item["category"],
                price=item["price"],
                image=item["image"],
                image_key=None,
                in_stock=item.get("inStock", True),
                popular=item.get("popular", False),
                weight=item.get("weight"),
                names=item["names"],
                descriptions=item["descriptions"],
            )
        )

    db.commit()
    return len(items)
