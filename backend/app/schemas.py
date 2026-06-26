from pydantic import BaseModel, Field
from typing import Literal, Optional


ProductCategory = Literal["meat", "sausage", "grocery", "dairy", "spice", "frozen"]


class LocalizedText(BaseModel):
    ko: str
    en: str
    ru: str
    uz: str


class Product(BaseModel):
    id: str
    category: ProductCategory
    price: int
    image: str
    inStock: bool
    popular: bool = False
    weight: Optional[str] = None
    names: LocalizedText
    descriptions: LocalizedText


class ProductCreate(BaseModel):
    id: str
    category: ProductCategory
    price: int
    image: str
    inStock: bool = True
    popular: bool = False
    weight: Optional[str] = None
    names: LocalizedText
    descriptions: LocalizedText


class ProductUpdate(BaseModel):
    category: Optional[ProductCategory] = None
    price: Optional[int] = None
    image: Optional[str] = None
    inStock: Optional[bool] = None
    popular: Optional[bool] = None
    weight: Optional[str] = None
    names: Optional[LocalizedText] = None
    descriptions: Optional[LocalizedText] = None


class ProductListResponse(BaseModel):
    items: list[Product]
    total: int


class UploadResponse(BaseModel):
    url: str
    key: str


class OrderItem(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)


class ShippingInfo(BaseModel):
    name: str
    phone: str
    address: str
    city: str
    postal_code: str


class CreateOrderRequest(BaseModel):
    items: list[OrderItem]
    shipping: ShippingInfo
    payment_method: Literal["card", "bank"] = "card"
    locale: str = "ko"


class CreateOrderResponse(BaseModel):
    order_id: str
    message: str
    total: int


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    email: str
    message: str
