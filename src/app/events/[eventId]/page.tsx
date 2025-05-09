"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useDialogStore } from "@/store/dialog";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setLoginDialogOpen = useDialogStore((s) => s.setLoginDialogOpen);
  const setLoginTab = useDialogStore((s) => s.setLoginTab);
  const router = useRouter();

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push(`/events/${eventId}/checkout`);
    } else {
      setLoginTab("signin");
      setLoginDialogOpen(true);
      toast.error("請先登入才能購票");
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">活動詳情</h1>
      <div className="mb-4">
        活動 ID：<span className="font-mono">{eventId}</span>
      </div>
      <div className="text-gray-500 mb-8">活動詳細資訊</div>
      <Button
        type="button"
        size="lg"
        className="font-bold text-lg"
        onClick={handleCheckout}
      >
        立即報名
      </Button>
    </main>
  );
}
