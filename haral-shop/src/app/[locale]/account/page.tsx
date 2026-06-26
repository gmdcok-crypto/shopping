import { setRequestLocale } from "next-intl/server";
import { AccountPage } from "./AccountPage";

export default async function Account({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AccountPage />;
}
