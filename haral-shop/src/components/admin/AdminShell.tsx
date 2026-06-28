"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Store,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { clearAdminApiKey } from "@/lib/admin-auth";

const NAV_GROUPS = [
  {
    title: "홈",
    items: [{ href: "/admin/", label: "대시보드", icon: LayoutDashboard }],
  },
  {
    title: "상품관리",
    items: [
      { href: "/admin/products/", label: "상품 목록", icon: Package },
      { href: "/admin/products/new/", label: "상품 등록", icon: PlusCircle },
    ],
  },
  {
    title: "판매관리",
    items: [{ href: "/admin/orders/", label: "주문 목록", icon: ShoppingCart }],
  },
  {
    title: "스토어관리",
    items: [{ href: "/admin/settings/", label: "스토어 설정", icon: Store }],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f7]">
      <header className="flex h-12 shrink-0 items-center justify-between bg-[#03a94d] px-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-tight">HARAL 판매자센터</span>
          <span className="hidden rounded bg-white/20 px-2 py-0.5 text-[11px] sm:inline">
            관리자
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/ko/"
            target="_blank"
            className="flex items-center gap-1 text-white/90 hover:text-white"
          >
            스토어 보기
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAdminApiKey();
              window.location.href = "/admin/login/";
            }}
            className="flex items-center gap-1 text-white/90 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 bg-white px-2 py-2 lg:hidden">
          {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  active
                    ? "bg-emerald-50 text-[#03a94d]"
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
            {NAV_GROUPS.map((group) => (
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
                              ? "border-r-2 border-[#03a94d] bg-emerald-50 font-semibold text-[#03a94d]"
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
