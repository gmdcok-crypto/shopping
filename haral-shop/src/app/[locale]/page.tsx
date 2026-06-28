import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeTopSection } from "@/components/HomeTopSection";
import { HomeStorefront } from "@/components/HomeStorefront";
import { HERO_BANNERS } from "@/lib/hero-banners";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("hero.banners");
  const bannerItems = HERO_BANNERS.map((banner) => ({
    ...banner,
    badge: t(`${banner.id}.badge`),
    title: t(`${banner.id}.title`),
    subtitle: t(`${banner.id}.subtitle`),
    cta: t(`${banner.id}.cta`),
  }));

  return (
    <>
      <HomeTopSection items={bannerItems} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-400">...</div>
        }
      >
        <HomeStorefront />
      </Suspense>
    </>
  );
}
