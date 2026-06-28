"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  fetchAdminDashboard,
  formatAdminDate,
  formatAdminPrice,
  type AdminDashboard,
} from "@/lib/api-admin";

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
      <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
    );
  }

  const { summary, recent_orders, low_stock } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">
          오늘의 주문·매출 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="오늘 매출"
          value={formatAdminPrice(summary.today_sales)}
          sub={`주문 ${summary.today_orders}건`}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          label="이번 주 매출"
          value={formatAdminPrice(summary.week_sales)}
          sub={`주문 ${summary.week_orders}건`}
          icon={ShoppingCart}
          accent="blue"
        />
        <StatCard
          label="등록 상품"
          value={`${summary.total_products}개`}
          sub={`판매중 ${summary.in_stock_products} / 품절 ${summary.out_of_stock_products}`}
          icon={Package}
          accent="amber"
        />
        <StatCard
          label="누적 매출"
          value={formatAdminPrice(summary.total_sales)}
          sub={`총 주문 ${summary.total_orders}건`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">최근 주문</h2>
            <Link
              href="/admin/orders/"
              className="text-sm font-medium text-[#03a94d] hover:underline"
            >
              전체 보기
            </Link>
          </div>
          {recent_orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              아직 주문이 없습니다.
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
                        {order.id} · {formatAdminDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatAdminPrice(order.total)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.item_count}개 상품
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
            <h2 className="font-bold text-gray-900">품절 상품</h2>
            <Link
              href="/admin/products/"
              className="text-sm font-medium text-[#03a94d] hover:underline"
            >
              상품 관리
            </Link>
          </div>
          {low_stock.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              품절 상품이 없습니다.
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
