"use client";

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

  return (
    <div className="flex flex-wrap gap-2 lg:hidden">
      {NAV_CATEGORIES.map((cat) => {
        const Icon = categoryIcons[cat];
        const isActive = active === cat;

        return (
          <Link
            key={cat}
            href={categoryHref(cat, basePath)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
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
  );
}
