"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchAdminOrder,
  fetchAdminOrders,
  formatAdminDate,
  formatAdminPrice,
  type AdminOrder,
} from "@/lib/api-admin";

function OrderDetail({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">주문 {order.id}</h2>
          <p className="text-sm text-gray-500">{formatAdminDate(order.created_at)}</p>
        </div>
        <p className="text-xl font-bold text-[#03a94d]">
          {formatAdminPrice(order.total)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-gray-900">배송 정보</p>
          <p className="text-gray-700">{order.name}</p>
          <p className="text-gray-600">{order.phone}</p>
          <p className="mt-1 text-gray-600">
            ({order.postal_code}) {order.city} {order.address}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-gray-900">결제 정보</p>
          <p className="text-gray-600">
            결제수단: {order.payment_method === "card" ? "카드" : "계좌이체"}
          </p>
          <p className="text-gray-600">언어: {order.locale}</p>
          <p className="mt-2 text-gray-600">
            상품금액 {formatAdminPrice(order.subtotal)}
          </p>
          <p className="text-gray-600">
            배송비 {formatAdminPrice(order.shipping_fee)}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs text-gray-500">
            <tr>
              <th className="py-2 pr-4">상품</th>
              <th className="py-2 pr-4">수량</th>
              <th className="py-2 pr-4">단가</th>
              <th className="py-2">합계</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={item.product_id}>
                <td className="py-3 pr-4">
                  <p className="font-medium text-gray-900">
                    {item.product_name ?? item.product_id}
                  </p>
                  <p className="text-xs text-gray-400">{item.product_id}</p>
                </td>
                <td className="py-3 pr-4">{item.quantity}</td>
                <td className="py-3 pr-4">{formatAdminPrice(item.unit_price)}</td>
                <td className="py-3 font-medium">
                  {formatAdminPrice(item.line_total ?? item.quantity * item.unit_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersPageInner() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOrders()
      .then((res) => setOrders(res.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }
    fetchAdminOrder(selectedId)
      .then(setSelected)
      .catch((e) => setError(e.message));
  }, [selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">주문 목록</h1>
        <p className="mt-1 text-sm text-gray-500">
          신규 주문부터 배송 정보까지 확인합니다.
        </p>
      </div>

      {selected && <OrderDetail order={selected} />}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading && (
          <p className="py-16 text-center text-sm text-gray-400">불러오는 중...</p>
        )}
        {error && (
          <p className="py-16 text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-400">
            아직 주문이 없습니다.
          </p>
        )}
        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">주문번호</th>
                  <th className="px-4 py-3">주문자</th>
                  <th className="px-4 py-3">연락처</th>
                  <th className="px-4 py-3">상품수</th>
                  <th className="px-4 py-3">결제금액</th>
                  <th className="px-4 py-3">주문일시</th>
                  <th className="px-4 py-3">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50/50 ${
                      selectedId === order.id ? "bg-emerald-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{order.name}</td>
                    <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}개
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatAdminPrice(order.total)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatAdminDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/orders/?id=${order.id}`}
                        className="font-medium text-[#03a94d] hover:underline"
                      >
                        보기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      }
    >
      <OrdersPageInner />
    </Suspense>
  );
}
