import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";

// 直接複製 Order 型別
export type Order = {
  id: string;
  status: string;
  paidAt: string | null;
  paidExpiredAt: string;
  paymentMethod: string | null;
  activity: {
    title: string;
    location: string;
    startTime: string;
    endTime: string;
  };
};

interface OrderCardProps {
  order: Order;
}

// 工具函式：格式化日期
function formatEventTime(start: string, end: string) {
  const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
  const startDate = new Date(start.replace(/-/g, "/"));
  const endDate = new Date(end.replace(/-/g, "/"));
  const y = startDate.getFullYear();
  const m = String(startDate.getMonth() + 1).padStart(2, "0");
  const d = String(startDate.getDate()).padStart(2, "0");
  const w = weekMap[startDate.getDay()];
  const startHM = startDate.toTimeString().slice(0, 5);
  const endHM = endDate.toTimeString().slice(0, 5);
  return `${y}.${m}.${d} (${w}) ${startHM} - ${endHM}`;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
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
  const statusText = order.status;

  return (
    <Link
      href={`/attendee/orders/${order.id}`}
      className={`block w-full cursor-pointer mb-4 border transition-shadow ${order.status === "已取消" || order.status === "已逾期" ? "bg-gray-100 text-gray-400" : "bg-white"}`}
    >
      <div
        className={`w-full border transition-shadow bg-white flex items-center px-8 py-6 pr-16 ${order.status === "已使用" || order.status === "已逾期" ? "opacity-60" : ""}`}
      >
        <div className="w-full md:flex md:flex-row md:items-center">
          <div className="flex-shrink-0 flex items-center h-full mb-4 md:mb-0 order-1 md:order-2">
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusClass}`}>
              {statusText}
            </span>
          </div>
          <div className="flex-1 min-w-0 flex items-center order-2 md:order-1">
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold mb-4">{order.activity.title}</div>
              <div className="flex items-center text-sm text-gray-600 mb-2 gap-6">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {formatEventTime(order.activity.startTime, order.activity.endTime)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {order.activity.location}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-2">訂單編號：{order.id}</div>
              <div className="text-sm text-gray-500">付款方式：{order.paymentMethod ?? "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
