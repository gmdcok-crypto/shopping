import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroPromoCarousel } from "@/components/HeroPromoCarousel";
import { Storefront } from "@/components/Storefront";
import { HERO_BANNERS } from "@/lib/hero-banners";
import type { ProductCategory } from "@/lib/products";

export const dynamic = "force-dynamic";

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

  const t = await getTranslations("hero.banners");
  const bannerItems = HERO_BANNERS.map((banner) => ({
    ...banner,
    badge: t(`${banner.id}.badge`),
    title: t(`${banner.id}.title`),
    subtitle: t(`${banner.id}.subtitle`),
    cta: t(`${banner.id}.cta`),
  }));

  const validCategories = ["meat", "sausage", "grocery", "dairy", "spice", "frozen"];
  const activeCategory = validCategories.includes(category ?? "")
    ? (category as ProductCategory)
    : "all";

  return (
    <>
      <HeroPromoCarousel sectionTitle={t("sectionTitle")} items={bannerItems} />
      <Storefront category={activeCategory} searchQuery={q} sort={sort} />
    </>
  );
}
