"use client";
import { useAuthStore } from "@/store/auth";
import { useDialogStore } from "@/store/dialog";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setLoginDialogOpen = useDialogStore((s) => s.setLoginDialogOpen);
  const setLoginTab = useDialogStore((s) => s.setLoginTab);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoginTab("signin");
      setLoginDialogOpen(true);
      toast.error("請先登入才能購票");
    }
  }, [isAuthenticated, setLoginDialogOpen, setLoginTab]);

  if (!isAuthenticated) return null;

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">活動購票</h1>
      <div className="text-gray-500">這裡是購票頁面。</div>
    </main>
  );
}
