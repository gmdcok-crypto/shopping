import { getTranslations, setRequestLocale } from "next-intl/server";
import { Storefront } from "@/components/Storefront";
import { products } from "@/lib/products";
import type { ProductCategory } from "@/lib/products";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const { category, q, sort } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("hero");
  const validCategories = ["meat", "sausage", "grocery", "dairy", "spice", "frozen"];
  const activeCategory = validCategories.includes(category ?? "")
    ? (category as ProductCategory)
    : "all";

  const productCount = products.length;

  return (
    <>
      <section className="border-b border-emerald-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            {t("title")}{" "}
            <span className="text-emerald-600">{t("titleHighlight")}</span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-gray-600 leading-relaxed sm:text-base">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex gap-8 sm:gap-12">
            <div>
              <div className="text-2xl font-bold text-emerald-700 sm:text-3xl">
                {productCount}
              </div>
              <div className="mt-1 text-xs text-gray-500 sm:text-sm">
                {t("statsProducts")}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700 sm:text-3xl">
                10K+
              </div>
              <div className="mt-1 text-xs text-gray-500 sm:text-sm">
                {t("statsUsers")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Storefront
        category={activeCategory}
        searchQuery={q}
        sort={sort}
      />
    </>
  );
}
