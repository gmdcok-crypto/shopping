"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/api-admin";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

export default function AdminNewProductPage() {
  const router = useRouter();
  const { t } = useAdminI18n();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(values: ProductFormValues) {
    setSaving(true);
    try {
      await createProduct({
        id: values.id,
        category: values.category,
        price: values.price,
        image: values.image,
        inStock: values.inStock,
        popular: values.popular,
        weight: values.weight || undefined,
        names: values.names,
        descriptions: values.descriptions,
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/products/"), 1200);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/products/"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t("common.backToList")}
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">{t("products.newTitle")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("products.newSubtitle")}</p>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {t("products.newSuccess")}
        </div>
      )}

      <ProductForm isNew saving={saving} onSubmit={handleSubmit} />
    </div>
  );
}
