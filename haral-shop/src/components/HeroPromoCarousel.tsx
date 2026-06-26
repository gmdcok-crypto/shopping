"use client";

import { Link } from "@/i18n/navigation";
import type { HeroBannerItem } from "@/lib/hero-banners";

interface HeroPromoCarouselProps {
  sectionTitle: string;
  items: HeroBannerItem[];
}

export function HeroPromoCarousel({ sectionTitle, items }: HeroPromoCarouselProps) {
  const loop = [...items, ...items];

  return (
    <section className="border-b border-emerald-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 sm:text-lg">{sectionTitle}</h2>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            {items.length} EVENTS
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-gray-50 to-transparent sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-gray-50 to-transparent sm:w-12" />

          <div className="hero-marquee flex w-max gap-3 py-1 sm:gap-4">
            {loop.map((banner, i) => (
              <article
                key={`${banner.id}-${i}`}
                className={`relative h-44 w-[min(88vw,320px)] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg sm:h-48 sm:w-[300px] lg:h-52 lg:w-[340px] ${banner.gradient} ${banner.pattern}`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 flex h-full flex-col justify-center px-5 py-4">
                  <span className="mb-2 inline-flex w-fit rounded-full bg-white/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                    {banner.badge}
                  </span>
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">
                    {banner.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/90 sm:text-sm">
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.href}
                    className="pointer-events-auto mt-3 inline-flex w-fit items-center rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm transition hover:bg-emerald-50 sm:text-sm"
                  >
                    {banner.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
