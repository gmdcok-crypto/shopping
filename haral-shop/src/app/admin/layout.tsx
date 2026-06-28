import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { AdminI18nProvider } from "@/components/admin/AdminI18nProvider";

export const metadata = {
  title: "HARAL Shop Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminI18nProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminI18nProvider>
  );
}
