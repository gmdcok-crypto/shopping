"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import { clearAdminApiKey } from "@/lib/admin-auth";
import {
  AdminLocaleSwitcher,
  useAdminI18n,
} from "@/components/admin/AdminI18nProvider";
import {
  ADMIN_NAV,
  getAdminNavHref,
  isAdminNavActive,
} from "@/lib/admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature");
  const { locale, t } = useAdminI18n();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-emerald-800 bg-emerald-700 px-5 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/" className="flex items-center gap-3">
            <span className="rounded-lg bg-white/15 px-3 py-1 text-lg font-bold tracking-tight">
              {t("shell.brand")}
            </span>
            <span className="hidden text-base font-medium text-emerald-100 sm:inline">
              {t("shell.title")}
            </span>
          </Link>
          <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-medium">
            {t("shell.badge")}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <AdminLocaleSwitcher />
          <Link
            href={locale === "en" ? "/en/" : "/ko/"}
            target="_blank"
            className="hidden items-center gap-1.5 text-emerald-100 hover:text-white sm:flex"
          >
            {t("shell.viewStore")}
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminApiKey();
              window.location.href = "/admin/login/";
            }}
            className="flex items-center gap-1.5 text-emerald-100 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t("shell.logout")}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-gray-200 bg-white lg:block lg:max-h-[calc(100vh-4rem)]">
          <nav className="py-5">
            {ADMIN_NAV.map((group) => (
              <div key={group.titleKey} className="mb-6">
                <p className="mb-2 px-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t(group.titleKey)}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const href = getAdminNavHref(item);
                    const active = isAdminNavActive(pathname, item, feature);
                    const label = t(item.labelKey);

                    return (
                      <li key={href + item.labelKey}>
                        <Link
                          href={href}
                          className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                            active
                              ? "border-r-[3px] border-emerald-600 bg-emerald-50 font-semibold text-emerald-800"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="min-w-0 flex-1 leading-snug">{label}</span>
                          {!item.ready && (
                            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                              {t("shell.comingSoon")}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <nav className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-3 py-3 lg:hidden">
            {ADMIN_NAV.flatMap((g) => g.items)
              .filter((item) => item.ready)
              .map((item) => {
                const Icon = item.icon;
                const href = getAdminNavHref(item);
                const active = isAdminNavActive(pathname, item, feature);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
          </nav>

          <main className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
