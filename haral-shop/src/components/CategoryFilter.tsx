"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProductCategory } from "@/lib/products";
import {
  NAV_CATEGORIES,
  categoryHref,
  categoryIcons,
} from "@/lib/category-nav";

interface CategoryFilterProps {
  active: ProductCategory | "all";
  basePath?: string;
}

export function CategoryFilter({ active, basePath = "/" }: CategoryFilterProps) {
  const t = useTranslations("categories");
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:hidden">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {NAV_CATEGORIES.map((cat) => {
          const Icon = categoryIcons[cat];
          const isActive = active === cat;

          return (
            <Link
              key={cat}
              ref={isActive ? activeRef : undefined}
              href={categoryHref(cat, basePath)}
              className={`flex shrink-0 snap-start items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t(cat)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
