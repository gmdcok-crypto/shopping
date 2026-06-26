"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingCart, Minus, Plus } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const t = useTranslations("products");
  const tCart = useTranslations("cart");
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(productId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-xl border border-gray-200">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-3 text-gray-600 hover:text-emerald-700 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="p-3 text-gray-600 hover:text-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={handleAdd}
        className={`flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all ${
          added
            ? "bg-emerald-100 text-emerald-700"
            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
        }`}
      >
        <ShoppingCart className="h-4 w-4" />
        {added ? tCart("itemAdded") : t("addToCart")}
      </button>
    </div>
  );
}
