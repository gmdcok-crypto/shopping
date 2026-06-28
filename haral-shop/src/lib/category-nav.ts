import {
  Drumstick,
  Package,
  ShoppingBasket,
  GlassWater,
  Flame,
  Snowflake,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { ProductCategory } from "@/lib/products";

export const NAV_CATEGORIES: (ProductCategory | "all")[] = [
  "all",
  "meat",
  "sausage",
  "grocery",
  "dairy",
  "spice",
  "frozen",
];

export const categoryIcons: Record<ProductCategory | "all", LucideIcon> = {
  all: LayoutGrid,
  meat: Drumstick,
  sausage: Package,
  grocery: ShoppingBasket,
  dairy: GlassWater,
  spice: Flame,
  frozen: Snowflake,
};

export function categoryHref(cat: ProductCategory | "all", basePath = "/"): string {
  return cat === "all" ? basePath : `${basePath}?category=${cat}`;
}
