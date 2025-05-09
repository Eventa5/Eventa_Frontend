"use client";
import { useAuthStore } from "@/store/auth";

export default function CheckoutPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return null;

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">活動購票</h1>
      <div className="text-gray-500">這裡是購票頁面。</div>
    </main>
  );
}
