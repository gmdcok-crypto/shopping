"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { fetchProducts } from "@/lib/api-client";
import {
  CATEGORY_LABELS,
  formatAdminPrice,
} from "@/lib/api-admin";
import type { Product } from "@/lib/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <h1 className="text-xl font-bold text-gray-900">상품 목록</h1>
          <p className="mt-1 text-sm text-gray-500">
            등록된 상품을 조회·수정합니다.
          </p>
        </div>
        <Link
          href="/admin/products/new/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#03a94d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#029443]"
        >
          <Plus className="h-4 w-4" />
          상품 등록
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="상품명, ID 검색"
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        {loading && (
          <p className="py-16 text-center text-sm text-gray-400">불러오는 중...</p>
        )}
        {error && (
          <p className="py-16 text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">상품</th>
                  <th className="px-4 py-3">카테고리</th>
                  <th className="px-4 py-3">가격</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3">관리</th>
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
                            {product.names.ko}
                          </p>
                          <p className="text-xs text-gray-400">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {CATEGORY_LABELS[product.category]}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatAdminPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {product.inStock ? "판매중" : "품절"}
                      </span>
                      {product.popular && (
                        <span className="ml-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          인기
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/edit/?id=${product.id}`}
                        className="font-medium text-[#03a94d] hover:underline"
                      >
                        수정
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
