"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

function ShopRedirectInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const query: Record<string, string> = {};
    for (const key of ["category", "q", "sort"] as const) {
      const value = searchParams.get(key);
      if (value) query[key] = value;
    }
    router.replace({ pathname: "/", query });
  }, [searchParams, router]);

  return null;
}

export function ShopRedirect() {
  return (
    <Suspense fallback={null}>
      <ShopRedirectInner />
    </Suspense>
  );
}
