const LOCAL_API = "http://127.0.0.1:8000";

function getApiBase(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return (process.env.API_URL || LOCAL_API).replace(/\/$/, "");
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
  const res = await fetch(getApiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
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
