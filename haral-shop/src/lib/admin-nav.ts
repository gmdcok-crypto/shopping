import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Activity,
  ListTodo,
  Package,
  PlusCircle,
  Tags,
  Boxes,
  ShoppingCart,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  MapPin,
  FileSpreadsheet,
  RotateCcw,
  Users,
  Crown,
  UserX,
  Ticket,
  Coins,
  Sparkles,
  Image,
  LayoutGrid,
  Star,
  MessageSquare,
  Bell,
  HelpCircle,
  BarChart3,
  TrendingUp,
  LineChart,
  Settings,
  CreditCard,
  Link2,
  Warehouse,
  Smartphone,
} from "lucide-react";
import type { AdminMessageKey } from "./admin-messages";

export interface AdminNavItem {
  labelKey: AdminMessageKey;
  icon: LucideIcon;
  ready?: boolean;
  href?: string;
  feature?: string;
}

export interface AdminNavGroup {
  titleKey: AdminMessageKey;
  items: AdminNavItem[];
}

function soon(feature: string): Pick<AdminNavItem, "feature"> {
  return { feature };
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    titleKey: "shell.nav.groupDashboard",
    items: [
      { labelKey: "shell.nav.dashboard", icon: LayoutDashboard, ready: true, href: "/admin/" },
      { labelKey: "shell.nav.realtimeStats", icon: Activity, ...soon("realtime-stats") },
      { labelKey: "shell.nav.workTodo", icon: ListTodo, ...soon("work-todo") },
    ],
  },
  {
    titleKey: "shell.nav.groupProducts",
    items: [
      { labelKey: "shell.nav.productList", icon: Package, ready: true, href: "/admin/products/" },
      { labelKey: "shell.nav.productNew", icon: PlusCircle, ready: true, href: "/admin/products/new/" },
      { labelKey: "shell.nav.categories", icon: Tags, ...soon("categories") },
      { labelKey: "shell.nav.inventory", icon: Boxes, ...soon("inventory") },
    ],
  },
  {
    titleKey: "shell.nav.groupOrders",
    items: [
      { labelKey: "shell.nav.orderList", icon: ShoppingCart, ready: true, href: "/admin/orders/" },
      { labelKey: "shell.nav.paymentPending", icon: Clock, ...soon("payment-pending") },
      { labelKey: "shell.nav.paymentDone", icon: CheckCircle2, ...soon("payment-done") },
      { labelKey: "shell.nav.shippingPrep", icon: PackageCheck, ...soon("shipping-prep") },
      { labelKey: "shell.nav.shippingTransit", icon: Truck, ...soon("shipping-transit") },
      { labelKey: "shell.nav.shippingDone", icon: MapPin, ...soon("shipping-done") },
      { labelKey: "shell.nav.tracking", icon: FileSpreadsheet, ...soon("tracking") },
      { labelKey: "shell.nav.returns", icon: RotateCcw, ...soon("returns") },
    ],
  },
  {
    titleKey: "shell.nav.groupMembers",
    items: [
      { labelKey: "shell.nav.memberList", icon: Users, ...soon("member-list") },
      { labelKey: "shell.nav.memberGrade", icon: Crown, ...soon("member-grade") },
      { labelKey: "shell.nav.dormantWithdraw", icon: UserX, ...soon("dormant-withdraw") },
    ],
  },
  {
    titleKey: "shell.nav.groupMarketing",
    items: [
      { labelKey: "shell.nav.coupons", icon: Ticket, ...soon("coupons") },
      { labelKey: "shell.nav.points", icon: Coins, ...soon("points") },
      { labelKey: "shell.nav.events", icon: Sparkles, ...soon("events") },
    ],
  },
  {
    titleKey: "shell.nav.groupCms",
    items: [
      { labelKey: "shell.nav.bannersPopup", icon: Image, ...soon("banners-popup") },
      { labelKey: "shell.nav.mainDisplay", icon: LayoutGrid, ...soon("main-display") },
    ],
  },
  {
    titleKey: "shell.nav.groupCs",
    items: [
      { labelKey: "shell.nav.reviews", icon: Star, ...soon("reviews") },
      { labelKey: "shell.nav.inquiries", icon: MessageSquare, ...soon("inquiries") },
      { labelKey: "shell.nav.noticeFaq", icon: HelpCircle, ...soon("notice-faq") },
      { labelKey: "shell.nav.notifications", icon: Bell, ...soon("notifications") },
    ],
  },
  {
    titleKey: "shell.nav.groupAnalytics",
    items: [
      { labelKey: "shell.nav.salesStats", icon: BarChart3, ...soon("sales-stats") },
      { labelKey: "shell.nav.productAnalytics", icon: TrendingUp, ...soon("product-analytics") },
      { labelKey: "shell.nav.visitAnalytics", icon: LineChart, ...soon("visit-analytics") },
    ],
  },
  {
    titleKey: "shell.nav.groupSettings",
    items: [
      { labelKey: "shell.nav.settings", icon: Settings, ready: true, href: "/admin/settings/" },
      { labelKey: "shell.nav.paymentPolicy", icon: CreditCard, ...soon("payment-policy") },
      { labelKey: "shell.nav.channelSync", icon: Link2, ...soon("channel-sync") },
      { labelKey: "shell.nav.logisticsErp", icon: Warehouse, ...soon("logistics-erp") },
      { labelKey: "shell.nav.alertService", icon: Smartphone, ...soon("alert-service") },
    ],
  },
];

export const COMING_SOON_FEATURES: Record<string, AdminMessageKey> = Object.fromEntries(
  ADMIN_NAV.flatMap((group) =>
    group.items
      .filter((item) => item.feature)
      .map((item) => [item.feature!, item.labelKey])
  )
) as Record<string, AdminMessageKey>;

export function getAdminNavHref(item: AdminNavItem): string {
  if (item.ready && item.href) return item.href;
  return `/admin/coming-soon/?feature=${item.feature ?? "unknown"}`;
}

export function isAdminNavActive(
  pathname: string,
  item: AdminNavItem,
  feature?: string | null
): boolean {
  if (item.feature) {
    return (
      pathname.startsWith("/admin/coming-soon") && feature === item.feature
    );
  }
  const href = getAdminNavHref(item);
  if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
  const base = href.split("?")[0].replace(/\/$/, "");
  return pathname === base || pathname === `${base}/` || pathname.startsWith(`${base}/`);
}
