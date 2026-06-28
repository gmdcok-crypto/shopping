"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Construction } from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { COMING_SOON_FEATURES } from "@/lib/admin-nav";

function ComingSoonInner() {
  const searchParams = useSearchParams();
  const { t } = useAdminI18n();
  const feature = searchParams.get("feature") ?? "";
  const labelKey = COMING_SOON_FEATURES[feature];

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">{t("common.comingSoonTitle")}</h1>
      {labelKey && (
        <p className="mt-2 text-base font-medium text-emerald-700">{t(labelKey)}</p>
      )}
      <p className="mt-4 text-sm leading-relaxed text-gray-500">
        {t("common.comingSoonBody")}
      </p>
      <Link
        href="/admin/"
        className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        {t("common.backToDashboard")}
      </Link>
    </div>
  );
}

export default function AdminComingSoonPage() {
  const { t } = useAdminI18n();

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-gray-400">{t("common.loading")}</div>
      }
    >
      <ComingSoonInner />
    </Suspense>
  );
}
