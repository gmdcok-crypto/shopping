"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { locales, localeNames, type Locale } from "@/i18n/routing";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Globe,
  ChevronDown,
} from "lucide-react";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const itemCount = useCartStore((s) => s.getItemCount());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-12">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg">
            H
          </div>
          <span className="text-xl font-bold text-emerald-800 tracking-tight">
            HARAL
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form action="/" className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                name="q"
                placeholder={t("search")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{localeNames[currentLocale] ?? "한국어"}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                {locales.map((locale) => (
                  <Link
                    key={locale}
                    href={pathname}
                    locale={locale}
                    onClick={() => setLangOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-emerald-50 ${
                      currentLocale === locale
                        ? "text-emerald-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {localeNames[locale]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/account"
            className="rounded-lg p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-emerald-50"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden border-t border-emerald-100 px-4 py-3">
          <form action="/">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                name="q"
                placeholder={t("search")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </form>
        </div>
      )}

      {mobileOpen && (
        <nav className="md:hidden border-t border-emerald-100 px-4 py-3 space-y-1">
          <Link
            href="/account"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50"
          >
            {t("account")}
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50"
          >
            {t("cart")}
          </Link>
        </nav>
      )}
    </header>
  );
}
