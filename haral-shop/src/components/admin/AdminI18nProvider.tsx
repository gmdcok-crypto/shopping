"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ADMIN_LOCALE_LABELS,
  ADMIN_LOCALES,
  type AdminLocale,
  type AdminMessageKey,
  createAdminT,
  getStoredAdminLocale,
  setStoredAdminLocale,
} from "@/lib/admin-messages";

interface AdminI18nContextValue {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: AdminMessageKey, params?: Record<string, string | number>) => string;
}

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>("ko");

  useEffect(() => {
    setLocaleState(getStoredAdminLocale());
  }, []);

  const setLocale = useCallback((next: AdminLocale) => {
    setStoredAdminLocale(next);
    setLocaleState(next);
  }, []);

  const t = useMemo(() => createAdminT(locale), [locale]);

  return (
    <AdminI18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) {
    throw new Error("useAdminI18n must be used within AdminI18nProvider");
  }
  return ctx;
}

export function AdminLocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useAdminI18n();

  return (
    <div className={`flex overflow-hidden rounded-md border border-white/30 ${className}`}>
      {ADMIN_LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          className={`px-2.5 py-1 text-xs font-medium transition-colors ${
            locale === loc
              ? "bg-white text-emerald-700"
              : "text-white/90 hover:bg-white/10"
          }`}
        >
          {ADMIN_LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
