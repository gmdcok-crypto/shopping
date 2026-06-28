"use client";

import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

export default function AdminSettingsPage() {
  const { locale, t } = useAdminI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("settings.subtitle")}</p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">{t("settings.basicInfo")}</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">{t("settings.storeName")}</dt>
            <dd className="font-medium text-gray-900">HARAL</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">{t("settings.storeUrl")}</dt>
            <dd className="font-medium text-gray-900">
              {locale === "en" ? "/en/" : "/ko/"}
            </dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">{t("settings.shippingPolicy")}</dt>
            <dd className="font-medium text-gray-900">{t("settings.freeShipping")}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">{t("settings.adminAuth")}</dt>
            <dd className="font-medium text-gray-900">{t("settings.apiKeyAuth")}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-semibold">{t("settings.noticeTitle")}</p>
        <p className="mt-2 leading-relaxed text-amber-800">{t("settings.noticeBody")}</p>
      </section>
    </div>
  );
}
