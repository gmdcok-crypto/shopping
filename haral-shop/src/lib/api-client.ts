import { apiFetch } from "./api";
import type { Product, ProductCategory } from "./products";

export interface ProductListResponse {
  items: Product[];
  total: number;
}

export async function fetchProducts(params?: {
  category?: ProductCategory | "all";
  q?: string;
  sort?: string;
  popular?: boolean;
}): Promise<ProductListResponse> {
  const search = new URLSearchParams();
  if (params?.category && params.category !== "all") {
    search.set("category", params.category);
  }
  if (params?.q) search.set("q", params.q);
  if (params?.sort) search.set("sort", params.sort);
  if (params?.popular) search.set("popular", "true");

  const qs = search.toString();
  return apiFetch<ProductListResponse>(`/api/products${qs ? `?${qs}` : ""}`);
}

export async function fetchProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`);
}

export interface OrderItemPayload {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
  };
  payment_method: "card" | "bank";
  locale: string;
}

export interface CreateOrderResponse {
  order_id: string;
  message: string;
  total: number;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  return apiFetch<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; email: string; message: string }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
}

export async function register(
  email: string,
  password: string
): Promise<{ token: string; email: string; message: string }> {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
}
