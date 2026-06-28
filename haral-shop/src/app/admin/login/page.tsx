"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { setAdminApiKey, clearAdminApiKey } from "@/lib/admin-auth";
import { verifyAdminKey } from "@/lib/api-admin";

export default function AdminLoginPage() {
  const router = useRouter();
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
        setError("API 키가 올바르지 않습니다.");
        return;
      }
      router.replace("/admin/");
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#03a94d] text-white">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">HARAL 판매자센터</h1>
          <p className="mt-1 text-sm text-gray-500">
            관리자 API 키로 로그인하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">API 키</span>
            <input
              type="password"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="ADMIN_API_KEY"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-[#03a94d] focus:outline-none focus:ring-2 focus:ring-[#03a94d]/20"
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
            className="w-full rounded-lg bg-[#03a94d] py-3 text-sm font-semibold text-white hover:bg-[#029443] disabled:opacity-60"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Railway / 서버 환경변수 <code className="text-gray-500">ADMIN_API_KEY</code> 값을
          입력하세요.
        </p>
      </div>
    </div>
  );
}
