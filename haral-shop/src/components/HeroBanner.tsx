"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_BANNERS } from "@/lib/hero-banners";

const AUTOPLAY_MS = 4000;
const GAP_PX = 12;
const SWIPE_THRESHOLD = 40;

export function HeroBanner() {
  const t = useTranslations("hero.banners");
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [slideStep, setSlideStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = HERO_BANNERS.length;

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const slide = viewport.querySelector<HTMLElement>("[data-banner-slide]");
    if (!slide) return;
    setSlideStep(slide.offsetWidth + GAP_PX);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (isPaused || slideStep === 0) return;
    const timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index, isPaused, goTo, slideStep]);

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
    <section className="border-b border-emerald-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 sm:text-lg">
            {t("sectionTitle")}
          </h2>
          <span className="text-xs font-medium text-gray-500 sm:text-sm">
            {index + 1} / {count}
          </span>
        </div>

        <div
          className="group relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
          aria-roledescription="carousel"
          aria-label={t("ariaLabel")}
        >
          <div ref={viewportRef} className="overflow-hidden rounded-2xl">
            <div
              className="flex gap-3 transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{
                transform:
                  slideStep > 0
                    ? `translate3d(-${index * slideStep}px, 0, 0)`
                    : undefined,
              }}
            >
              {HERO_BANNERS.map((banner, slideIndex) => (
                <article
                  key={banner.id}
                  data-banner-slide
                  className={`relative h-40 w-[88%] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br shadow-md sm:h-48 sm:w-[calc(50%-6px)] lg:h-52 lg:w-[calc(33.333%-8px)] ${banner.gradient} ${banner.pattern}`}
                  aria-hidden={slideIndex !== index}
                >
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="relative z-10 flex h-full flex-col justify-center px-5 py-4 sm:px-6">
                    <span className="mb-2 inline-flex w-fit rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white sm:text-xs">
                      {t(`${banner.id}.badge`)}
                    </span>
                    <h3 className="line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg lg:text-xl">
                      {t(`${banner.id}.title`)}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/90 sm:text-sm">
                      {t(`${banner.id}.subtitle`)}
                    </p>
                    <Link
                      href={banner.href}
                      className="mt-3 inline-flex w-fit items-center rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm transition hover:bg-emerald-50 sm:text-sm"
                    >
                      {t(`${banner.id}.cta`)}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute -left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition hover:bg-emerald-50 sm:-left-4 sm:h-10 sm:w-10"
            aria-label={t("prev")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute -right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition hover:bg-emerald-50 sm:-right-4 sm:h-10 sm:w-10"
            aria-label={t("next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-3 flex justify-center gap-2">
            {HERO_BANNERS.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-7 bg-emerald-600"
                    : "w-2 bg-gray-300 hover:bg-emerald-300"
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
