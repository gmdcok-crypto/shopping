const STORAGE_KEY = "haral_admin_api_key";

export function getAdminApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminApiKey(key: string): void {
  sessionStorage.setItem(STORAGE_KEY, key);
}

export function clearAdminApiKey(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminApiKey());
}
