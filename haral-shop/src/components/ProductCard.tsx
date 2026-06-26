"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import {
  getProductName,
  formatPrice,
  type Product,
} from "@/lib/products";
import { ShoppingCart, BadgeCheck } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={getProductName(product, locale)}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
          <BadgeCheck className="h-3 w-3" />
          {t("halal")}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
          {getProductName(product, locale)}
        </h3>
        {product.weight && (
          <p className="mb-2 text-xs text-gray-400">{product.weight}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-bold text-emerald-700">
            {formatPrice(product.price, locale)}
            <span className="ml-0.5 text-xs font-normal text-gray-500">₩</span>
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              product.inStock
                ? added
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added ? "✓" : t("addToCart")}
          </button>
        </div>
      </div>
    </Link>
  );
}
