"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { createOrder, fetchProducts } from "@/lib/api-client";
import { formatPrice, type Product } from "@/lib/products";
import { CheckCircle } from "lucide-react";

export function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [products, setProducts] = useState<Product[]>([]);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts().then((res) => setProducts(res.items)).catch(() => setProducts([]));
  }, []);

  const items = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return cartItems
      .map((item) => {
        const product = map.get(item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter(Boolean) as { product: Product; quantity: number }[];
  }, [cartItems, products]);

  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 3000;

  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      router.push("/cart");
    }
  }, [cartItems.length, success, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payment = form.get("payment") as "card" | "bank";

    try {
      const result = await createOrder({
        items: cartItems.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
        shipping: {
          name: String(form.get("name") ?? ""),
          phone: String(form.get("phone") ?? ""),
          address: String(form.get("address") ?? ""),
          city: String(form.get("city") ?? ""),
          postal_code: String(form.get("postalCode") ?? ""),
        },
        payment_method: payment ?? "card",
        locale,
      });
      clearCart();
      setOrderId(result.order_id);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon("error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!success && cartItems.length === 0) {
    return null;
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">{t("success")}</h1>
        <p className="mt-2 text-gray-500">{t("successDesc")}</p>
        {orderId && (
          <p className="mt-2 text-sm font-mono text-emerald-700">#{orderId}</p>
        )}
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {tCart("continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">{t("shippingInfo")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-gray-600">{t("name")}</label>
                <input name="name" required className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">{t("phone")}</label>
                <input name="phone" required type="tel" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">{t("city")}</label>
                <input name="city" required className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-gray-600">{t("address")}</label>
                <input name="address" required className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">{t("postalCode")}</label>
                <input name="postalCode" required className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">{t("payment")}</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 cursor-pointer">
                <input type="radio" name="payment" value="card" defaultChecked className="text-emerald-600" />
                <span className="text-sm font-medium">{t("card")}</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-emerald-200">
                <input type="radio" name="payment" value="bank" className="text-emerald-600" />
                <span className="text-sm font-medium">{t("bank")}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-fit">
          <h2 className="mb-4 text-lg font-semibold">{t("orderSummary")}</h2>
          <div className="space-y-2 text-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-gray-600">
                <span className="truncate mr-2">×{quantity}</span>
                <span>{formatPrice(product.price * quantity, locale)} ₩</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-emerald-700">
              <span>{tCart("total")}</span>
              <span>{formatPrice(subtotal + shipping, locale)} {tCommon("won")}</span>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {submitting ? tCommon("loading") : t("placeOrder")}
          </button>
        </div>
      </form>
    </div>
  );
}
