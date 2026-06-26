"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_BANNERS } from "@/lib/hero-banners";

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 48;

export function HeroBanner() {
  const t = useTranslations("hero.banners");
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = HERO_BANNERS.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index, isPaused, goTo]);

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - clientX;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      goTo(delta > 0 ? index + 1 : index - 1);
    }
    touchStartX.current = null;
  };

  return (
    <section className="border-b border-emerald-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div
          className="group relative overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
          aria-roledescription="carousel"
          aria-label={t("ariaLabel")}
        >
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {HERO_BANNERS.map((banner, slideIndex) => (
              <article
                key={banner.id}
                className={`relative flex min-w-full flex-col justify-center bg-gradient-to-br ${banner.gradient} ${banner.pattern} aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.8/1]`}
                aria-hidden={slideIndex !== index}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 flex h-full flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 md:px-14 lg:px-16">
                  <span className="mb-3 inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm sm:text-sm">
                    {t(`${banner.id}.badge`)}
                  </span>
                  <h2 className="max-w-xl text-xl font-bold leading-tight text-white sm:max-w-2xl sm:text-3xl md:text-4xl">
                    {t(`${banner.id}.title`)}
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/90 sm:mt-3 sm:text-base md:text-lg">
                    {t(`${banner.id}.subtitle`)}
                  </p>
                  <Link
                    href={banner.href}
                    className="mt-5 inline-flex w-fit items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-emerald-50 sm:mt-6 sm:px-6 sm:py-3"
                  >
                    {t(`${banner.id}.cta`)}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md opacity-0 transition hover:bg-white focus:opacity-100 group-hover:opacity-100 sm:left-4 sm:h-10 sm:w-10"
            aria-label={t("prev")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md opacity-0 transition hover:bg-white focus:opacity-100 group-hover:opacity-100 sm:right-4 sm:h-10 sm:w-10"
            aria-label={t("next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-4">
            {HERO_BANNERS.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={t(`${banner.id}.title`)}
                aria-current={i === index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
