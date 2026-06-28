"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { fetchProducts } from "@/lib/api-client";
import type { Product, ProductCategory } from "@/lib/products";

interface StorefrontProps {
  category: ProductCategory | "all";
  searchQuery?: string;
  sort?: string;
}

export function Storefront({ category, searchQuery, sort }: StorefrontProps) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts({ category, q: searchQuery, sort })
      .then((res) => setProducts(res.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, searchQuery, sort]);

  return (
    <div id="products" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mb-[2mm] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {loading ? "..." : t("results", { count: products.length })}
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

      <div className="mb-[2mm] lg:hidden">
        <CategoryFilter active={category} />
      </div>

      {loading && (
        <div className="py-20 text-center text-gray-400">{tCommon("loading")}</div>
      )}
      {error && (
        <div className="py-20 text-center text-red-500">{error}</div>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="py-20 text-center text-gray-500">{t("notFound")}</div>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
