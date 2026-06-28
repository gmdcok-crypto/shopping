from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import verify_admin
from app.models import Order, Product

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(verify_admin)])


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = today_start - timedelta(days=7)

    orders = db.query(Order).all()
    products = db.query(Product).all()

    today_orders = [o for o in orders if o.created_at >= today_start]
    week_orders = [o for o in orders if o.created_at >= week_start]

    return {
        "summary": {
            "total_products": len(products),
            "in_stock_products": sum(1 for p in products if p.in_stock),
            "out_of_stock_products": sum(1 for p in products if not p.in_stock),
            "total_orders": len(orders),
            "today_orders": len(today_orders),
            "today_sales": sum(o.total for o in today_orders),
            "week_orders": len(week_orders),
            "week_sales": sum(o.total for o in week_orders),
            "total_sales": sum(o.total for o in orders),
        },
        "recent_orders": [
            {
                "id": o.id,
                "name": o.name,
                "total": o.total,
                "created_at": o.created_at.isoformat(),
                "item_count": sum(i.quantity for i in o.items),
            }
            for o in sorted(orders, key=lambda x: x.created_at, reverse=True)[:5]
        ],
        "low_stock": [
            {"id": p.id, "name": p.names.get("ko", p.id), "in_stock": p.in_stock}
            for p in products
            if not p.in_stock
        ][:5],
    }
