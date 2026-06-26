"use client";

import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import {
  getProductsByCategory,
  getProductName,
  type ProductCategory,
} from "@/lib/products";
import { useLocale } from "next-intl";

interface StorefrontProps {
  category: ProductCategory | "all";
  searchQuery?: string;
  sort?: string;
}

export function Storefront({ category, searchQuery, sort }: StorefrontProps) {
  const t = useTranslations("products");
  const locale = useLocale();

  let filtered = getProductsByCategory(category);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        getProductName(p, locale).toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  if (sort === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else {
    filtered = [...filtered].sort(
      (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    );
  }

  return (
    <div id="products" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {t("results", { count: filtered.length })}
        </p>
        <select
          defaultValue={sort ?? "popular"}
          onChange={(e) => {
            const url = new URL(window.location.href);
            if (e.target.value === "popular") {
              url.searchParams.delete("sort");
            } else {
              url.searchParams.set("sort", e.target.value);
            }
            window.location.href = url.toString();
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="popular">{t("sortPopular")}</option>
          <option value="price-low">{t("sortPriceLow")}</option>
          <option value="price-high">{t("sortPriceHigh")}</option>
        </select>
      </div>

      <div className="mb-8">
        <CategoryFilter active={category} />
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-500">{t("notFound")}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
