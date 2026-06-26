import { setRequestLocale } from "next-intl/server";
import { HeroBanner } from "@/components/HeroBanner";
import { Storefront } from "@/components/Storefront";
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

  const validCategories = ["meat", "sausage", "grocery", "dairy", "spice", "frozen"];
  const activeCategory = validCategories.includes(category ?? "")
    ? (category as ProductCategory)
    : "all";

  return (
    <>
      <HeroBanner />
      <Storefront category={activeCategory} searchQuery={q} sort={sort} />
    </>
  );
}
