"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { fetchProduct } from "@/lib/api-client";
import { updateProduct, uploadProductImage } from "@/lib/api-admin";
import type { Product } from "@/lib/products";

function EditProductInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id") ?? "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError("상품 ID가 없습니다.");
      setLoading(false);
      return;
    }
    fetchProduct(productId)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleSubmit(values: ProductFormValues) {
    setSaving(true);
    setSuccess(false);
    try {
      const updated = await updateProduct(productId, {
        category: values.category,
        price: values.price,
        image: values.image,
        inStock: values.inStock,
        popular: values.popular,
        weight: values.weight || undefined,
        names: values.names,
        descriptions: values.descriptions,
      });
      setProduct(updated);
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(file: File) {
    const updated = await uploadProductImage(productId, file);
    setProduct(updated);
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error ?? "상품을 찾을 수 없습니다."}</p>
        <button
          type="button"
          onClick={() => router.push("/admin/products/")}
          className="text-sm text-[#03a94d] hover:underline"
        >
          상품 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products/"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← 상품 목록
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">상품 수정</h1>
        <p className="mt-1 text-sm text-gray-500">{product.names.ko}</p>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          저장되었습니다.
        </div>
      )}

      <ProductForm
        key={product.image}
        initial={product}
        saving={saving}
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}

export default function AdminEditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      }
    >
      <EditProductInner />
    </Suspense>
  );
}
