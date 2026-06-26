import { setRequestLocale } from "next-intl/server";
import { CartPage } from "./CartPage";

export default async function Cart({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CartPage />;
}
