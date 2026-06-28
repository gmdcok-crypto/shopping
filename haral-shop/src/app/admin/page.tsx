"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { fetchAdminDashboard, type AdminDashboard } from "@/lib/api-admin";
import { formatAdminDate, formatAdminPrice } from "@/lib/admin-messages";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "emerald",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: "emerald" | "blue" | "amber" | "rose";
}) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { locale, t } = useAdminI18n();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminDashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        {t("common.loading")}
      </div>
    );
  }

  const { summary, recent_orders, low_stock } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("dashboard.todaySales")}
          value={formatAdminPrice(summary.today_sales, locale)}
          sub={t("dashboard.ordersSub", { count: summary.today_orders })}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          label={t("dashboard.weekSales")}
          value={formatAdminPrice(summary.week_sales, locale)}
          sub={t("dashboard.ordersSub", { count: summary.week_orders })}
          icon={ShoppingCart}
          accent="blue"
        />
        <StatCard
          label={t("dashboard.totalProducts")}
          value={t("common.items", { count: summary.total_products })}
          sub={t("dashboard.stockSub", {
            inStock: summary.in_stock_products,
            outOfStock: summary.out_of_stock_products,
          })}
          icon={Package}
          accent="amber"
        />
        <StatCard
          label={t("dashboard.totalSales")}
          value={formatAdminPrice(summary.total_sales, locale)}
          sub={t("dashboard.totalOrdersSub", { count: summary.total_orders })}
          icon={TrendingUp}
        />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-gray-900">{t("dashboard.workTodo")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("dashboard.todoPayment"), href: "/admin/coming-soon/?feature=payment-pending", count: 0 },
            { label: t("dashboard.todoShipping"), href: "/admin/coming-soon/?feature=shipping-prep", count: 0 },
            { label: t("dashboard.todoReturns"), href: "/admin/coming-soon/?feature=returns", count: 0 },
            { label: t("dashboard.todoMembers"), href: "/admin/coming-soon/?feature=member-list", count: 0 },
          ].map((todo) => (
            <Link
              key={todo.href}
              href={todo.href}
              className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 hover:border-emerald-200 hover:bg-emerald-50/50"
            >
              <p className="text-xs text-gray-500">{todo.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{todo.count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="font-bold text-gray-900">{t("dashboard.salesTrend")}</h2>
        <p className="mt-2 text-sm text-gray-500">{t("dashboard.trendPlaceholder")}</p>
        <Link
          href="/admin/coming-soon/?feature=sales-stats"
          className="mt-4 inline-flex text-sm font-medium text-emerald-600 hover:underline"
        >
          {t("shell.nav.salesStats")} →
        </Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">{t("dashboard.recentOrders")}</h2>
            <Link
              href="/admin/orders/"
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          {recent_orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              {t("dashboard.noOrders")}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent_orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/?id=${order.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.id} · {formatAdminDate(order.created_at, locale)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatAdminPrice(order.total, locale)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("common.products", { count: order.item_count })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">{t("dashboard.outOfStock")}</h2>
            <Link
              href="/admin/products/"
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              {t("dashboard.manageProducts")}
            </Link>
          </div>
          {low_stock.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              {t("dashboard.noOutOfStock")}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {low_stock.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/edit/?id=${product.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">{product.id}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
