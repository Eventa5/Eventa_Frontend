"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">活動詳情</h1>
      <div className="mb-4">
        活動 ID：<span className="font-mono">{eventId}</span>
      </div>
      <div className="text-gray-500 mb-8">活動詳細資訊</div>
      <Link href={`/events/${eventId}/checkout`}>
        <Button
          type="button"
          size="lg"
          className="font-bold text-lg"
        >
          立即報名
        </Button>
      </Link>
    </main>
  );
}
