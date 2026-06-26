import { setRequestLocale } from "next-intl/server";
import { CheckoutPage } from "./CheckoutPage";

export default async function Checkout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CheckoutPage />;
}
