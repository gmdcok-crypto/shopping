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

  return (
    <section className="border-b border-emerald-100 bg-gray-50">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((banner) => (
            <article
              key={banner.id}
              className={`relative h-44 w-full shrink-0 bg-gradient-to-br sm:h-52 lg:h-56 ${banner.gradient} ${banner.pattern}`}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-5 sm:px-8 lg:px-10">
                <span className="mb-2 inline-flex w-fit rounded-full bg-white/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                  {banner.badge}
                </span>
                <h3 className="max-w-xl text-xl font-bold leading-snug text-white sm:text-2xl lg:text-3xl">
                  {banner.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">
                  {banner.subtitle}
                </p>
                <Link
                  href={banner.href}
                  className="mt-4 inline-flex w-fit items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-emerald-50"
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
    </section>
  );
}
