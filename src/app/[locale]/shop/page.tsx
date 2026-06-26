import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { locale } = await params;
  const { category, q, sort } = await searchParams;
  setRequestLocale(locale);

  const query: Record<string, string> = {};
  if (category) query.category = category;
  if (q) query.q = q;
  if (sort) query.sort = sort;

  redirect({ href: { pathname: "/", query }, locale });
}
