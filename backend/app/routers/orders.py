import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import verify_admin
from app.models import Order, OrderItem, Product
from app.schemas import CreateOrderRequest, CreateOrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=CreateOrderResponse)
def create_order(payload: CreateOrderRequest, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = 0
    line_items: list[tuple[Product, int]] = []

    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Unknown product: {item.product_id}")
        if not product.in_stock:
            raise HTTPException(status_code=400, detail=f"Out of stock: {item.product_id}")
        subtotal += product.price * item.quantity
        line_items.append((product, item.quantity))

    shipping_fee = 0 if subtotal >= 50000 else 3000
    order_id = str(uuid.uuid4())[:8].upper()

    order = Order(
        id=order_id,
        name=payload.shipping.name,
        phone=payload.shipping.phone,
        address=payload.shipping.address,
        city=payload.shipping.city,
        postal_code=payload.shipping.postal_code,
        payment_method=payload.payment_method,
        locale=payload.locale,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=subtotal + shipping_fee,
    )

    for product, quantity in line_items:
        order.items.append(
            OrderItem(
                product_id=product.id,
                quantity=quantity,
                unit_price=product.price,
            )
        )

    db.add(order)
    db.commit()

    return CreateOrderResponse(
        order_id=order_id,
        message="Order placed successfully",
        total=subtotal + shipping_fee,
    )


@router.get("", dependencies=[Depends(verify_admin)])
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return {
        "items": [
            {
                "id": o.id,
                "name": o.name,
                "phone": o.phone,
                "address": o.address,
                "city": o.city,
                "postal_code": o.postal_code,
                "payment_method": o.payment_method,
                "subtotal": o.subtotal,
                "shipping_fee": o.shipping_fee,
                "total": o.total,
                "locale": o.locale,
                "created_at": o.created_at.isoformat(),
                "items": [
                    {
                        "product_id": i.product_id,
                        "quantity": i.quantity,
                        "unit_price": i.unit_price,
                    }
                    for i in o.items
                ],
            }
            for o in orders
        ],
        "total": len(orders),
    }


@router.get("/{order_id}", dependencies=[Depends(verify_admin)])
def get_order(order_id: str, db: Session = Depends(get_db)):
    from fastapi import HTTPException

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    product_names: dict[str, str] = {}
    for item in order.items:
        if item.product_id not in product_names:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            product_names[item.product_id] = (
                product.names.get("ko", item.product_id) if product else item.product_id
            )

    return {
        "id": order.id,
        "name": order.name,
        "phone": order.phone,
        "address": order.address,
        "city": order.city,
        "postal_code": order.postal_code,
        "payment_method": order.payment_method,
        "subtotal": order.subtotal,
        "shipping_fee": order.shipping_fee,
        "total": order.total,
        "locale": order.locale,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "product_id": i.product_id,
                "product_name": product_names.get(i.product_id, i.product_id),
                "quantity": i.quantity,
                "unit_price": i.unit_price,
                "line_total": i.quantity * i.unit_price,
            }
            for i in order.items
        ],
    }
