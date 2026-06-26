from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import auth, orders, products, upload
from app.services.seed import seed_products


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        seeded = seed_products(db)
        if seeded:
            print(f"Seeded {seeded} products into database")
    finally:
        db.close()
    yield


app = FastAPI(
    title="HARAL API",
    description="Halal shopping mall API for foreigners in Korea",
    version="2.0.0",
    lifespan=lifespan,
)

extra_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=extra_origins,
    allow_origin_regex=r"https://([a-zA-Z0-9-]+\.)*((up\.)?railway\.app|netlify\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix=settings.api_prefix)
app.include_router(orders.router, prefix=settings.api_prefix)
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(upload.router, prefix=settings.api_prefix)


@app.get("/")
def root():
    return {
        "service": "HARAL API",
        "docs": "/docs",
        "storage": "r2" if settings.r2_configured else "disabled",
        "database": "mysql" if "mysql" in settings.database_url else "other",
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}
