"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { HeroBannerItem } from "@/lib/hero-banners";

interface HeroPromoCarouselProps {
  items: HeroBannerItem[];
}

const SLIDE_MS = 5000;

export function HeroPromoCarousel({ items }: HeroPromoCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const active = items[index];

  return (
    <section
      className={`border-b border-gray-100 transition-colors duration-700 ${active.sectionBg}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl shadow-md">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((banner) => (
              <article
                key={banner.id}
                className={`relative h-44 w-full shrink-0 bg-gradient-to-br sm:h-48 lg:h-52 ${banner.gradient} ${banner.pattern}`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 flex h-full flex-col justify-center px-5 py-4 sm:px-8">
                  <span className="mb-2 inline-flex w-fit rounded-full bg-white/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                    {banner.badge}
                  </span>
                  <h3 className="max-w-xl text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
                    {banner.title}
                  </h3>
                  <p className="mt-1 max-w-lg text-xs leading-relaxed text-white/90 sm:text-sm">
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.href}
                    className="mt-3 inline-flex w-fit items-center rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-emerald-50"
                  >
                    {banner.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {items.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
              {items.map((banner, i) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
