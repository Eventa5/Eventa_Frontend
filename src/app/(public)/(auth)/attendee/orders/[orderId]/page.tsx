"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getApiV1ActivitiesByActivityId } from "@/services/api/client/sdk.gen";
import type { ActivityResponse } from "@/services/api/client/types.gen";
import { FileText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function OrderDetailPage() {
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"split" | "refund" | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

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
    totalPrice: "1,000",
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

  let statusClass = "text-gray-600";
  switch (order.status) {
    case "待付款":
      statusClass = "text-neutral-800 bg-primary-200";
      break;
    case "已付款":
      statusClass = "text-neutral-800 bg-green-100";
      break;
    case "已逾期":
      statusClass = "text-neutral-500 bg-neutral-200";
      break;
    case "已取消":
      statusClass = "text-secondary-500 bg-secondary-100";
      break;
    case "已使用":
      statusClass = "text-white bg-neutral-400";
      break;
    default:
      statusClass = "text-gray-600";
  }

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
                <h3
                  className="text-xl font-semibold mb-4 leading-[1.2] font-serif-tc py-6 tracking-[0.15em]"
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  訂單資訊
                </h3>
              </div>
              <ul className="text-neutral-800 text-base">
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">訂單編號</span>
                  <span>{orderId}</span>
                </li>
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">總價</span>
                  {order.totalPrice}
                </li>
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">付款方式</span>
                  {order.payType}
                </li>
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">訂單狀態</span>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                    {order.status}
                  </span>
                </li>
                {/* 狀態對應操作按鈕 */}
                <li className="mb-4 flex items-center gap-2">
                  {order.status === "待付款" && (
                    <>
                      <Button
                        type="button"
                        className="bg-primary-500 text-neutral-800 px-4 py-1 rounded hover:bg-primary-600 mr-2"
                        onClick={() => router.push(`/attendee/orders/${order.id}/pay`)}
                      >
                        前往付款
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-neutral-300 text-neutral-600 px-4 py-1 rounded hover:bg-neutral-400 hover:text-white"
                        onClick={() => router.push(`/attendee/orders/${order.id}/cancel`)}
                      >
                        取消報名
                      </Button>
                    </>
                  )}
                  {/* 已付款與已逾期不顯示主操作按鈕 */}
                </li>
              </ul>
            </div>
            <Separator className="my-4 w-[90%] mx-auto" />
            <div className="flex">
              <div className="flex gap-2 mb-6">
                <h3
                  className="text-xl font-semibold mb-4 leading-[1.2] font-serif-tc py-6 tracking-[0.15em]"
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  參加者資訊
                </h3>
              </div>
              <ul className="text-neutral-800 text-base">
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">訂單編號</span>
                  <span>{order.id}</span>
                </li>
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">總價</span>
                  {order.totalPrice}
                </li>
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">付款方式</span>
                  {order.payType}
                </li>
                <li className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">訂單狀態</span>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                    {order.status}
                  </span>
                </li>
              </ul>
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
            {/* 只有已付款且未分票才顯示退票按鈕，否則維持原本邏輯 */}
            {ticket.status === "未分票" && order.status === "已付款" ? (
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
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleDialogOpen("refund")}
                    >
                      退票
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>是否進行退票？</DialogTitle>
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
            ) : ticket.status === "未分票" ? (
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
                  {/* 退票按鈕不顯示 */}
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
