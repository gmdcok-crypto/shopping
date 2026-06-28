"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product, ProductCategory } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/api-admin";

const CATEGORIES: ProductCategory[] = [
  "meat",
  "sausage",
  "grocery",
  "dairy",
  "spice",
  "frozen",
];

const LOCALES = ["ko", "en", "ru", "uz"] as const;
const LOCALE_LABELS: Record<(typeof LOCALES)[number], string> = {
  ko: "한국어",
  en: "English",
  ru: "Русский",
  uz: "O'zbek",
};

export interface ProductFormValues {
  id: string;
  category: ProductCategory;
  price: number;
  image: string;
  inStock: boolean;
  popular: boolean;
  weight: string;
  names: Record<(typeof LOCALES)[number], string>;
  descriptions: Record<(typeof LOCALES)[number], string>;
}

interface ProductFormProps {
  initial?: Product;
  isNew?: boolean;
  saving?: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onImageUpload?: (file: File) => Promise<void>;
}

export function emptyProductForm(): ProductFormValues {
  return {
    id: "",
    category: "meat",
    price: 0,
    image: "",
    inStock: true,
    popular: false,
    weight: "",
    names: { ko: "", en: "", ru: "", uz: "" },
    descriptions: { ko: "", en: "", ru: "", uz: "" },
  };
}

export function productToForm(product: Product): ProductFormValues {
  return {
    id: product.id,
    category: product.category,
    price: product.price,
    image: product.image,
    inStock: product.inStock,
    popular: product.popular ?? false,
    weight: product.weight ?? "",
    names: { ...product.names },
    descriptions: { ...product.descriptions },
  };
}

export function ProductForm({
  initial,
  isNew = false,
  saving = false,
  onSubmit,
  onImageUpload,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(
    initial ? productToForm(initial) : emptyProductForm()
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    setUploading(true);
    setError(null);
    try {
      await onImageUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">기본 정보</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">상품 ID</span>
            <input
              required
              disabled={!isNew}
              value={values.id}
              onChange={(e) =>
                setValues((v) => ({ ...v, id: e.target.value.trim() }))
              }
              placeholder="beef-steak"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm disabled:bg-gray-50"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">카테고리</span>
            <select
              value={values.category}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  category: e.target.value as ProductCategory,
                }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">가격 (원)</span>
            <input
              required
              type="number"
              min={0}
              value={values.price || ""}
              onChange={(e) =>
                setValues((v) => ({ ...v, price: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">중량</span>
            <input
              value={values.weight}
              onChange={(e) =>
                setValues((v) => ({ ...v, weight: e.target.value }))
              }
              placeholder="500g"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.inStock}
              onChange={(e) =>
                setValues((v) => ({ ...v, inStock: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            <span className="font-medium text-gray-700">판매 중</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.popular}
              onChange={(e) =>
                setValues((v) => ({ ...v, popular: e.target.checked }))
              }
              className="rounded border-gray-300"
            />
            <span className="font-medium text-gray-700">인기 상품</span>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">이미지</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {values.image && (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <Image
                src={values.image}
                alt={values.names.ko || values.id}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">이미지 URL</span>
              <input
                value={values.image}
                onChange={(e) =>
                  setValues((v) => ({ ...v, image: e.target.value }))
                }
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
              />
            </label>
            {onImageUpload && !isNew && (
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                {uploading ? "업로드 중..." : "이미지 파일 업로드"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">상품명 / 설명</h2>
        <div className="space-y-4">
          {LOCALES.map((locale) => (
            <div
              key={locale}
              className="rounded-lg border border-gray-100 bg-gray-50/50 p-4"
            >
              <p className="mb-3 text-xs font-semibold text-gray-500">
                {LOCALE_LABELS[locale]}
              </p>
              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-medium text-gray-700">상품명</span>
                <input
                  required={locale === "ko"}
                  value={values.names[locale]}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      names: { ...v.names, [locale]: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-700">설명</span>
                <textarea
                  rows={2}
                  value={values.descriptions[locale]}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      descriptions: {
                        ...v.descriptions,
                        [locale]: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#03a94d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#029443] disabled:opacity-60"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
}
