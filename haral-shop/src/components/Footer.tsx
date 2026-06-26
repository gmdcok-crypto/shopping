"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const cat = useTranslations("categories");

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold">
                H
              </div>
              <span className="font-bold text-gray-900">HARAL</span>
            </div>
            <p className="text-sm text-gray-500 max-w-md">{t("description")}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <Link href="/?category=meat" className="hover:text-emerald-700">{cat("meat")}</Link>
            <Link href="/?category=grocery" className="hover:text-emerald-700">{cat("grocery")}</Link>
            <Link href="/?category=spice" className="hover:text-emerald-700">{cat("spice")}</Link>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          {t("rights")}
          {process.env.NEXT_PUBLIC_BUILD_SHA &&
            process.env.NEXT_PUBLIC_BUILD_SHA !== "unknown" && (
              <span className="mt-1 block text-[10px] text-gray-300">
                build: {process.env.NEXT_PUBLIC_BUILD_SHA.slice(0, 7)}
              </span>
            )}
        </div>
      </div>
    </footer>
  );
}
