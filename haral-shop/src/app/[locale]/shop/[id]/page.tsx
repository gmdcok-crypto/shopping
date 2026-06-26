import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PRODUCT_IDS } from "@/lib/product-ids";
import { ProductDetailPage } from "./ProductDetailPage";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCT_IDS.map((id) => ({ locale, id }))
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProductDetailPage />;
}
