"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { setAdminApiKey, clearAdminApiKey } from "@/lib/admin-auth";
import { verifyAdminKey } from "@/lib/api-admin";
import {
  AdminLocaleSwitcher,
  useAdminI18n,
} from "@/components/admin/AdminI18nProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useAdminI18n();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      setAdminApiKey(apiKey.trim());
      const ok = await verifyAdminKey();
      if (!ok) {
        clearAdminApiKey();
        setError(t("login.invalidKey"));
        return;
      }
      router.replace("/admin/");
    } catch {
      setError(t("login.serverError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="flex items-center justify-between border-b border-emerald-800 bg-emerald-700 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <span className="rounded-md bg-white/15 px-2 py-0.5 text-sm font-bold">
            {t("shell.brand")}
          </span>
          <span className="text-sm text-emerald-100">{t("shell.title")}</span>
        </div>
        <AdminLocaleSwitcher />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              {t("shell.badge")}
            </p>
            <h1 className="mt-1 text-xl font-bold text-gray-900">{t("shell.title")}</h1>
            <p className="mt-2 text-sm text-gray-500">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">
                {t("login.apiKey")}
              </span>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ADMIN_API_KEY"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? t("login.verifying") : t("login.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">{t("login.hint")}</p>
        </div>
      </div>
    </div>
  );
}
