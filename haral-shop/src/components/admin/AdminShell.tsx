"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { clearAdminApiKey } from "@/lib/admin-auth";
import {
  AdminLocaleSwitcher,
  useAdminI18n,
} from "@/components/admin/AdminI18nProvider";

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, t } = useAdminI18n();

  const navGroups = [
    {
      title: t("shell.nav.home"),
      items: [{ href: "/admin/", label: t("shell.nav.dashboard"), icon: LayoutDashboard }],
    },
    {
      title: t("shell.nav.products"),
      items: [
        { href: "/admin/products/", label: t("shell.nav.productList"), icon: Package },
        { href: "/admin/products/new/", label: t("shell.nav.productNew"), icon: PlusCircle },
      ],
    },
    {
      title: t("shell.nav.sales"),
      items: [{ href: "/admin/orders/", label: t("shell.nav.orderList"), icon: ShoppingCart }],
    },
    {
      title: t("shell.nav.store"),
      items: [{ href: "/admin/settings/", label: t("shell.nav.settings"), icon: Settings }],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-emerald-800 bg-emerald-700 px-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/" className="flex items-center gap-2">
            <span className="rounded-md bg-white/15 px-2 py-0.5 text-base font-bold tracking-tight">
              {t("shell.brand")}
            </span>
            <span className="hidden text-sm font-medium text-emerald-100 sm:inline">
              {t("shell.title")}
            </span>
          </Link>
          <span className="rounded bg-white/15 px-2 py-0.5 text-[11px] font-medium">
            {t("shell.badge")}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <AdminLocaleSwitcher />
          <Link
            href={locale === "en" ? "/en/" : "/ko/"}
            target="_blank"
            className="hidden items-center gap-1 text-emerald-100 hover:text-white sm:flex"
          >
            {t("shell.viewStore")}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminApiKey();
              window.location.href = "/admin/login/";
            }}
            className="flex items-center gap-1 text-emerald-100 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("shell.logout")}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 bg-white px-2 py-2 lg:hidden">
          {navGroups.flatMap((g) => g.items).map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block">
          <nav className="py-4">
            {navGroups.map((group) => (
              <div key={group.title} className="mb-4">
                <p className="mb-1 px-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {group.title}
                </p>
                <ul>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                            active
                              ? "border-r-2 border-emerald-600 bg-emerald-50 font-semibold text-emerald-800"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
