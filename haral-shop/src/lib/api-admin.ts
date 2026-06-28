import { apiFetch, getApiUrl } from "./api";
import { getAdminApiKey } from "./admin-auth";
import type { Product, ProductCategory } from "./products";

function adminHeaders(extra?: HeadersInit): HeadersInit {
  const key = getAdminApiKey();
  if (!key) throw new Error("관리자 인증이 필요합니다.");
  return { "X-API-Key": key, ...extra };
}

export async function adminFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...adminHeaders(),
      ...(options?.headers as Record<string, string>),
    },
  });
}

export interface AdminDashboard {
  summary: {
    total_products: number;
    in_stock_products: number;
    out_of_stock_products: number;
    total_orders: number;
    today_orders: number;
    today_sales: number;
    week_orders: number;
    week_sales: number;
    total_sales: number;
  };
  recent_orders: {
    id: string;
    name: string;
    total: number;
    created_at: string;
    item_count: number;
  }[];
  low_stock: { id: string; name: string; in_stock: boolean }[];
}

export interface AdminOrderItem {
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  line_total?: number;
}

export interface AdminOrder {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  locale: string;
  created_at: string;
  items: AdminOrderItem[];
}

export interface ProductCreatePayload {
  id: string;
  category: ProductCategory;
  price: number;
  image: string;
  inStock: boolean;
  popular: boolean;
  weight?: string;
  names: { ko: string; en: string; ru: string; uz: string };
  descriptions: { ko: string; en: string; ru: string; uz: string };
}

export type ProductUpdatePayload = Partial<
  Omit<ProductCreatePayload, "id">
>;

export async function verifyAdminKey(): Promise<boolean> {
  try {
    await adminFetch<AdminDashboard>("/api/admin/dashboard");
    return true;
  } catch {
    return false;
  }
}

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  return adminFetch<AdminDashboard>("/api/admin/dashboard");
}

export async function fetchAdminOrders(): Promise<{
  items: AdminOrder[];
  total: number;
}> {
  return adminFetch("/api/orders");
}

export async function fetchAdminOrder(id: string): Promise<AdminOrder> {
  return adminFetch(`/api/orders/${id}`);
}

export async function createProduct(
  payload: ProductCreatePayload
): Promise<Product> {
  return adminFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(
  id: string,
  payload: ProductUpdatePayload
): Promise<Product> {
  return adminFetch<Product>(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<Product> {
  const key = getAdminApiKey();
  if (!key) throw new Error("관리자 인증이 필요합니다.");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    getApiUrl(`/api/upload/products/${productId}/image`),
    {
      method: "POST",
      headers: { "X-API-Key": key },
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Upload failed: ${res.status}`);
  }

  return res.json();
}

export function formatAdminPrice(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export function formatAdminDate(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  meat: "할랄 고기",
  sausage: "소시지",
  grocery: "식료품",
  dairy: "유제품",
  spice: "향신료",
  frozen: "냉동식품",
};
