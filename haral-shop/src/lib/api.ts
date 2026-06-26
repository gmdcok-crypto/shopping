function getApiBase(): string {
  const isServer = typeof window === "undefined";

  if (isServer) {
    const url = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL)?.replace(
      /\/$/,
      ""
    );
    if (url) return url;
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "API_URL is required. Add it in Netlify Environment variables, then redeploy."
      );
    }
    return "http://localhost:8000";
  }

  // Browser: same-origin /api/* → Next.js rewrite → Railway API
  const direct = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (direct) return direct;
  return "";
}

export function getApiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const isServer = typeof window === "undefined";
  const res = await fetch(getApiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...(isServer && !options?.cache ? { next: { revalidate: 60 } } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err.detail;
    const message = Array.isArray(detail)
      ? detail.map((d: { msg?: string }) => d.msg).join(", ")
      : detail ?? `API error: ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}
