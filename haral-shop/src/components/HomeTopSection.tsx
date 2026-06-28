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
    <section
      className={`border-b border-gray-100 transition-colors duration-700 ${active?.sectionBg ?? "bg-gray-50"}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <CategorySidebar />
          <div className="min-h-44 min-w-0 flex-1 sm:min-h-48 lg:min-h-[280px]">
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
