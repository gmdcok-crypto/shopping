"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";
import { fetchProduct, fetchProducts } from "@/lib/api-client";
import {
  getProductName,
  getProductDescription,
  formatPrice,
  type Product,
} from "@/lib/products";
import { BadgeCheck, ArrowLeft } from "lucide-react";

export function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const locale = useLocale();
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    setLoading(true);
    setNotFound(false);

    fetchProduct(id)
      .then((p) => {
        setProduct(p);
        return fetchProducts({ category: p.category })
          .then((data) =>
            setRelated(data.items.filter((item) => item.id !== p.id).slice(0, 4))
          )
          .catch(() => setRelated([]));
      })
      .catch(() => {
        setProduct(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">{tCommon("loading")}</div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p className="mb-4">{t("notFound")}</p>
        <Link href="/" className="text-emerald-600 hover:text-emerald-700">
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {tCommon("back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
          <Image
            src={product.image}
            alt={getProductName(product, locale)}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              {t("halal")}
            </span>
            {product.weight && (
              <span className="text-sm text-gray-400">{product.weight}</span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {getProductName(product, locale)}
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {getProductDescription(product, locale)}
          </p>

          <div className="mt-6 text-3xl font-bold text-emerald-700">
            {formatPrice(product.price, locale)}
            <span className="ml-1 text-base font-normal text-gray-500">₩</span>
          </div>

          <div className="mt-8">
            {product.inStock ? (
              <AddToCartButton productId={product.id} />
            ) : (
              <button
                disabled
                className="w-full rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed sm:w-auto sm:px-8"
              >
                {t("outOfStock")}
              </button>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-gray-900">{t("related")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
