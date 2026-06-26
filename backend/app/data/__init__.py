import json
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data" / "products.json"


def load_products() -> list[dict]:
    with open(DATA_PATH, encoding="utf-8") as f:
        return json.load(f)
