import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ShopRedirect } from "./ShopRedirect";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ShopRedirect />;
}
