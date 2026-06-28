"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { fetchProducts } from "@/lib/api-client";
import { formatAdminPrice } from "@/lib/admin-messages";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import type { Product, ProductCategory } from "@/lib/products";

export default function AdminProductsPage() {
  const { locale, t } = useAdminI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryLabel = (cat: ProductCategory) =>
    t(`categories.${cat}` as "categories.meat");

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.names.ko.toLowerCase().includes(q) ||
      p.names.en.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t("products.title")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("products.subtitle")}</p>
        </div>
        <Link
          href="/admin/products/new/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          {t("products.add")}
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("products.search")}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        {loading && (
          <p className="py-16 text-center text-sm text-gray-400">{t("common.loading")}</p>
        )}
        {error && (
          <p className="py-16 text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">{t("products.colProduct")}</th>
                  <th className="px-4 py-3">{t("products.colCategory")}</th>
                  <th className="px-4 py-3">{t("products.colPrice")}</th>
                  <th className="px-4 py-3">{t("products.colStatus")}</th>
                  <th className="px-4 py-3">{t("products.colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <Image
                            src={product.image}
                            alt={product.names.ko}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {locale === "en" ? product.names.en : product.names.ko}
                          </p>
                          <p className="text-xs text-gray-400">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {categoryLabel(product.category)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatAdminPrice(product.price, locale)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {product.inStock ? t("products.onSale") : t("products.soldOut")}
                      </span>
                      {product.popular && (
                        <span className="ml-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          {t("products.popular")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/edit/?id=${product.id}`}
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        {t("common.edit")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
