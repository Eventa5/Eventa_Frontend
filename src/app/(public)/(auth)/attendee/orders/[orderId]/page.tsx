"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function OrderDetailPage() {
  const router = useRouter();
  // 假資料
  const order = {
    id: "2022121720571882545141",
    title: "復古黑膠派對之夜",
    date: "2025.05.10 (六) 20:00 - 23:30",
    status: "待付款",
    location: "台北市",
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"split" | "refund" | null>(null);

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">訂單詳情</h1>
      <div className="border rounded p-4 mb-4">
        <div className="text-lg font-semibold mb-1">{order.title}</div>
        <div className="text-sm text-gray-600 mb-1">{order.date}</div>
        <div className="text-xs text-gray-500 mb-2">可單號：{order.id}</div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
          <span>📍{order.location}</span>
          <span>💳付款方式：{order.payType}</span>
        </div>
        <span className="border border-yellow-400 text-yellow-600 px-4 py-1 rounded-full text-sm">
          {order.status}
        </span>
      </div>

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
