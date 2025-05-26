"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getApiV1ActivitiesByActivityId } from "@/services/api/client/sdk.gen";
import type { ActivityResponse } from "@/services/api/client/types.gen";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function OrderDetailPage() {
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"split" | "refund" | null>(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        // TODO: 從訂單資料中獲取活動 ID
        const activityId = 1; // 這裡需要從訂單資料中獲取
        const response = await getApiV1ActivitiesByActivityId({
          path: { activityId },
        });
        if (response.data?.data) {
          setActivity(response.data.data);
        }
      } catch (error) {
        console.error("獲取活動資料失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  // 假資料
  const order = {
    id: "2022121720571882545141",
    status: "待付款",
    payType: "－",
  };
  const tickets = [
    {
      type: "一般票",
      sn: "12312313123879",
      valid: "2025.09.10 (三) 15:00",
      price: "1,000",
      owner: "－",
      status: "未分票",
    },
    {
      type: "一般票",
      sn: "12312313123878",
      valid: "2025.09.10 (三) 15:00",
      price: "1,000",
      owner: "Kai, kai@gmail.com",
      status: "已分票",
    },
  ];

  const handleDialogOpen = (type: "split" | "refund") => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    setDialogOpen(false);
    if (dialogType === "split") {
      router.push(`/attendee/orders/${order.id}/split`);
    } else if (dialogType === "refund") {
      router.push(`/attendee/orders/${order.id}/refund`);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">訂單詳情</h1>

      {/* 活動資訊區塊 */}
      {activity && (
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* 左側主內容 */}
          <div className="flex-1 min-w-0">
            {/* 標籤列 */}
            <div className="flex gap-2 mb-6">
              {activity?.categories?.map((category) => (
                <span
                  key={category.id}
                  className="bg-secondary-100 text-secondary-500 px-6 py-2 rounded-lg text-lg font-semibold"
                >
                  {category.name}
                </span>
              ))}
              <span className="bg-secondary-100 text-secondary-500 px-6 py-2 rounded-lg text-lg font-semibold">
                {" "}
                {activity?.isOnline ? "線上活動" : "線下活動"}
              </span>
            </div>
            {/* 標題 */}
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 md:mb-16 font-serif-tc">
              {activity.title}
            </h2>
            <div className="flex">
              <div className="flex gap-2 mb-6">
                <p
                  className="text-xl font-semibold mb-4 leading-[1.2] font-serif-tc py-6 tracking-[0.15em]"
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  訂單資訊
                </p>
              </div>
              <div>
                {/* 活動簡介 */}
                <div className="text-gray-700 mb-4">
                  {activity.summary || activity.descriptionMd || "這裡是活動簡介"}
                </div>
                {/* 活動資訊欄 */}
                <div className="space-y-3 text-base">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-gray-500">event</span>
                    <span className="font-semibold">活動時間</span>
                    <span>
                      {activity.startTime && activity.endTime
                        ? `${new Date(activity.startTime as string).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" })} ${new Date(activity.startTime as string).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })} - ${new Date(activity.endTime as string).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-gray-500">
                      location_on
                    </span>
                    <span className="font-semibold">活動地點</span>
                    <span>{activity.location || "-"}</span>
                  </div>
                  {/* 相關連結（可依需求調整） */}
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-gray-500">link</span>
                    <span className="font-semibold">相關連結</span>
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      心樂山螢火蟲保留區粉絲專頁
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 票券卡片 */}
      {tickets.map((ticket, idx) => (
        <div
          key={ticket.sn}
          className="border rounded p-4 flex justify-between items-start mb-4"
        >
          <div>
            <div className="text-base font-semibold mb-1">{ticket.type}</div>
            <div className="text-sm mb-1">票券編號：{ticket.sn}</div>
            <div className="text-sm mb-1">有效期限：{ticket.valid}</div>
            <div className="text-sm mb-1">票價：{ticket.price} 元</div>
            <div className="text-sm mb-1">票券持有者：{ticket.owner}</div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[100px]">
            {ticket.status === "未分票" ? (
              <>
                <span className="border border-yellow-400 text-yellow-600 px-4 py-1 rounded-full text-sm mb-2">
                  未分票
                </span>
                <Dialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-1 rounded mb-1 hover:bg-blue-700"
                      onClick={() => handleDialogOpen("split")}
                    >
                      分票
                    </button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleDialogOpen("refund")}
                    >
                      退票
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>
                      {dialogType === "split"
                        ? "是否進行分票？"
                        : dialogType === "refund"
                          ? "是否進行退票？"
                          : ""}
                    </DialogTitle>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          type="button"
                          className="px-4 py-1 rounded border border-gray-400 hover:bg-gray-100"
                        >
                          否
                        </button>
                      </DialogClose>
                      <button
                        type="button"
                        className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleDialogConfirm}
                      >
                        是
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <>
                <span className="border border-green-400 text-green-600 px-4 py-1 rounded-full text-sm mb-2">
                  已分票
                </span>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  onClick={() => router.push(`/attendee/tickets/${ticket.sn}`)}
                >
                  查看票券
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <div>（此頁面為假資料展示）</div>
    </div>
  );
}
