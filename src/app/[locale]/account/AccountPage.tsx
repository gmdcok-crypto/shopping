"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { User, Package, Settings, LogOut } from "lucide-react";

export function AccountPage() {
  const t = useTranslations("account");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {isRegister ? t("registerTitle") : t("loginTitle")}
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedIn(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm text-gray-600">{t("email")}</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">{t("password")}</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              {isRegister ? t("registerTitle") : t("loginTitle")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {isRegister ? t("loginTitle") : t("registerTitle")}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{t("title")}</h1>

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { icon: User, label: t("profile") },
          { icon: Package, label: t("orders") },
          { icon: Settings, label: t("settings") },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-emerald-200 transition-colors cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <Icon className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center text-gray-500">
        {t("noOrders")}
      </div>

      <button
        onClick={() => setIsLoggedIn(false)}
        className="mt-6 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 mx-auto"
      >
        <LogOut className="h-4 w-4" />
        {t("logout")}
      </button>
    </div>
  );
}
