"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import { AdminShell } from "./AdminShell";

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAdminI18n();
  const [ready, setReady] = useState(false);
  const isLogin =
    pathname === "/admin/login" || pathname === "/admin/login/";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login/");
      return;
    }
    setReady(true);
  }, [isLogin, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-500">
        {t("common.loading")}
      </div>
    );
  }

  if (isLogin) return <>{children}</>;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-500">
          {t("common.loading")}
        </div>
      }
    >
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
