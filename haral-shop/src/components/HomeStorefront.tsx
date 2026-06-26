"use client";

import { useSearchParams } from "next/navigation";
import { Storefront } from "@/components/Storefront";
import type { ProductCategory } from "@/lib/products";

const validCategories = ["meat", "sausage", "grocery", "dairy", "spice", "frozen"];

export function HomeStorefront() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const activeCategory = validCategories.includes(category)
    ? (category as ProductCategory)
    : "all";

  return (
    <Storefront
      category={activeCategory}
      searchQuery={searchParams.get("q") ?? undefined}
      sort={searchParams.get("sort") ?? undefined}
    />
  );
}
