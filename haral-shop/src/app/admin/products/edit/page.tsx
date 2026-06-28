"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { fetchProduct } from "@/lib/api-client";
import { updateProduct, uploadProductImage } from "@/lib/api-admin";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import type { Product } from "@/lib/products";

function EditProductInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, t } = useAdminI18n();
  const productId = searchParams.get("id") ?? "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError(t("products.noProductId"));
      setLoading(false);
      return;
    }
    fetchProduct(productId)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [productId, t]);

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
      <div className="py-20 text-center text-sm text-gray-400">{t("common.loading")}</div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error ?? t("products.notFound")}</p>
        <button
          type="button"
          onClick={() => router.push("/admin/products/")}
          className="text-sm text-emerald-600 hover:underline"
        >
          {t("common.backToList")}
        </button>
      </div>
    );
  }

  const displayName = locale === "en" ? product.names.en : product.names.ko;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products/"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t("common.backToList")}
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">{t("products.editTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">{displayName}</p>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t("common.saved")}
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
  const { t } = useAdminI18n();

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-400">{t("common.loading")}</div>
      }
    >
      <EditProductInner />
    </Suspense>
  );
}
