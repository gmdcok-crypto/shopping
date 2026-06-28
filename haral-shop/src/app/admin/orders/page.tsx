"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchAdminOrder,
  fetchAdminOrders,
  type AdminOrder,
} from "@/lib/api-admin";
import { formatAdminDate, formatAdminPrice } from "@/lib/admin-messages";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

function OrderDetail({ order }: { order: AdminOrder }) {
  const { locale, t } = useAdminI18n();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {t("orders.orderTitle", { id: order.id })}
          </h2>
          <p className="text-sm text-gray-500">
            {formatAdminDate(order.created_at, locale)}
          </p>
        </div>
        <p className="text-xl font-bold text-emerald-600">
          {formatAdminPrice(order.total, locale)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-gray-900">{t("orders.shipping")}</p>
          <p className="text-gray-700">{order.name}</p>
          <p className="text-gray-600">{order.phone}</p>
          <p className="mt-1 text-gray-600">
            ({order.postal_code}) {order.city} {order.address}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-sm">
          <p className="mb-2 font-semibold text-gray-900">{t("orders.payment")}</p>
          <p className="text-gray-600">
            {t("orders.paymentMethod")}:{" "}
            {order.payment_method === "card" ? t("orders.card") : t("orders.bank")}
          </p>
          <p className="text-gray-600">
            {t("orders.language")}: {order.locale}
          </p>
          <p className="mt-2 text-gray-600">
            {t("orders.subtotal")} {formatAdminPrice(order.subtotal, locale)}
          </p>
          <p className="text-gray-600">
            {t("orders.shippingFee")} {formatAdminPrice(order.shipping_fee, locale)}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs text-gray-500">
            <tr>
              <th className="py-2 pr-4">{t("orders.colProduct")}</th>
              <th className="py-2 pr-4">{t("orders.colQty")}</th>
              <th className="py-2 pr-4">{t("orders.colUnitPrice")}</th>
              <th className="py-2">{t("orders.colLineTotal")}</th>
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
                <td className="py-3 pr-4">
                  {formatAdminPrice(item.unit_price, locale)}
                </td>
                <td className="py-3 font-medium">
                  {formatAdminPrice(
                    item.line_total ?? item.quantity * item.unit_price,
                    locale
                  )}
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
  const { locale, t } = useAdminI18n();
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
        <h1 className="text-xl font-bold text-gray-900">{t("orders.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("orders.subtitle")}</p>
      </div>

      {selected && <OrderDetail order={selected} />}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading && (
          <p className="py-16 text-center text-sm text-gray-400">{t("common.loading")}</p>
        )}
        {error && (
          <p className="py-16 text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-400">
            {t("orders.noOrders")}
          </p>
        )}
        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">{t("orders.colOrderId")}</th>
                  <th className="px-4 py-3">{t("orders.colCustomer")}</th>
                  <th className="px-4 py-3">{t("orders.colPhone")}</th>
                  <th className="px-4 py-3">{t("orders.colItems")}</th>
                  <th className="px-4 py-3">{t("orders.colTotal")}</th>
                  <th className="px-4 py-3">{t("orders.colDate")}</th>
                  <th className="px-4 py-3">{t("orders.colDetail")}</th>
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
                      {t("common.items", {
                        count: order.items.reduce((s, i) => s + i.quantity, 0),
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatAdminPrice(order.total, locale)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatAdminDate(order.created_at, locale)}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/orders/?id=${order.id}`}
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        {t("common.view")}
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
  const { t } = useAdminI18n();

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-400">{t("common.loading")}</div>
      }
    >
      <OrdersPageInner />
    </Suspense>
  );
}
