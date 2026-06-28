"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import {
  NAV_CATEGORIES,
  categoryHref,
  categoryIcons,
} from "@/lib/category-nav";
import type { ProductCategory } from "@/lib/products";

const validCategories = ["meat", "sausage", "grocery", "dairy", "spice", "frozen"];

export function CategorySidebar() {
  const t = useTranslations("categories");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const active: ProductCategory | "all" = validCategories.includes(categoryParam)
    ? (categoryParam as ProductCategory)
    : "all";

  return (
    <aside className="hidden w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:flex lg:w-56 lg:flex-col xl:w-64">
      <div className="bg-emerald-600 px-4 py-3 text-sm font-bold text-white">
        {t("title")}
      </div>
      <nav className="flex flex-1 flex-col py-1">
        {NAV_CATEGORIES.map((cat) => {
          const Icon = categoryIcons[cat];
          const isActive = active === cat;

          return (
            <Link
              key={cat}
              href={categoryHref(cat)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-emerald-50 font-semibold text-emerald-800"
                  : "text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              <span className="min-w-0 flex-1 truncate">{t(cat)}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
