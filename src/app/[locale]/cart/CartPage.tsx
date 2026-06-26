"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { getProductName, formatPrice } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export function CartPage() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const items = useCartStore((s) => s.getCartProducts());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const shipping = subtotal >= 50000 ? 0 : 3000;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">{t("empty")}</h1>
        <p className="mt-2 text-gray-500">{t("emptyDesc")}</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{t("title")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <Image
                  src={product.image}
                  alt={getProductName(product, locale)}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <Link
                  href={`/shop/${product.id}`}
                  className="font-semibold text-gray-900 hover:text-emerald-700 transition-colors"
                >
                  {getProductName(product, locale)}
                </Link>
                <p className="mt-1 text-sm text-emerald-700 font-medium">
                  {formatPrice(product.price, locale)} ₩
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-gray-500 hover:text-emerald-700"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-gray-500 hover:text-emerald-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-fit">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("subtotal")}</span>
              <span className="font-medium">
                {formatPrice(subtotal, locale)} {tCommon("won")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t("shipping")}</span>
              <span className="font-medium">
                {shipping === 0
                  ? t("freeShipping")
                  : `${formatPrice(shipping, locale)} ${tCommon("won")}`}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base">
              <span className="font-semibold">{t("total")}</span>
              <span className="font-bold text-emerald-700">
                {formatPrice(subtotal + shipping, locale)} {tCommon("won")}
              </span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            {t("checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
