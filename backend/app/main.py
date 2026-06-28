from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from starlette.staticfiles import StaticFiles as StarletteStaticFiles

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import admin, auth, orders, products, upload
from app.services.seed import seed_products

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"


class NoCacheHtmlStaticFiles(StarletteStaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        content_type = response.headers.get("content-type", "")
        should_disable_cache = "text/html" in content_type or path in {
            "sw.js",
            "manifest.webmanifest",
        }
        if should_disable_cache:
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response


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
app.include_router(admin.router, prefix=settings.api_prefix)
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(upload.router, prefix=settings.api_prefix)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "storage": "r2" if settings.r2_configured else "disabled",
        "database": "mysql" if "mysql" in settings.database_url else "other",
        "frontend": STATIC_DIR.is_dir(),
    }


@app.get("/")
def root_redirect():
    return RedirectResponse(url="/ko/", status_code=307)


if STATIC_DIR.is_dir():
    app.mount("/", NoCacheHtmlStaticFiles(directory=STATIC_DIR, html=True), name="frontend")
