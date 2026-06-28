"use client";

import { Suspense, useEffect, useState } from "react";
import type { HeroBannerItem } from "@/lib/hero-banners";
import { CategorySidebar } from "@/components/CategorySidebar";
import { HeroPromoCarousel } from "@/components/HeroPromoCarousel";

interface HomeTopSectionProps {
  items: HeroBannerItem[];
}

const SLIDE_MS = 5000;

function HomeTopSectionInner({ items }: HomeTopSectionProps) {
  const [index, setIndex] = useState(0);
  const active = items[index] ?? items[0];

  useEffect(() => {
    setIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <CategorySidebar />
          <div
            className={`min-h-44 min-w-0 flex-1 rounded-xl p-2 transition-colors duration-700 sm:min-h-48 sm:p-3 lg:min-h-[280px] ${active?.sectionBg ?? "bg-gray-50"}`}
          >
            <HeroPromoCarousel
              items={items}
              embedded
              index={index}
              onIndexChange={setIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeTopSection({ items }: HomeTopSectionProps) {
  return (
    <Suspense fallback={null}>
      <HomeTopSectionInner items={items} />
    </Suspense>
  );
}
