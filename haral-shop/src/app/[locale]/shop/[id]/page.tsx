import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";
import { fetchProduct, fetchProducts } from "@/lib/api-client";
import {
  getProductName,
  getProductDescription,
  formatPrice,
} from "@/lib/products";
import { BadgeCheck, ArrowLeft } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let product;
  try {
    product = await fetchProduct(id);
  } catch {
    notFound();
  }

  const t = await getTranslations("products");
  const tCommon = await getTranslations("common");

  let related: Awaited<ReturnType<typeof fetchProducts>>["items"] = [];
  try {
    const data = await fetchProducts({ category: product.category });
    related = data.items.filter((p) => p.id !== product.id).slice(0, 4);
  } catch {
    related = [];
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
