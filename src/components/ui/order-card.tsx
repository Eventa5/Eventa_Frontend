import { formatEventDate } from "@/features/activities/formatEventDate";
import { orderStatusMap } from "@/features/orders/orderDetail";
import type { OrderResponse } from "@/services/api/client/types.gen";
import { CalendarIcon, GlobeIcon, MapPinIcon } from "lucide-react";
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
  order: OrderResponse;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  if (!order.activity || !order.activity.startTime || !order.activity.endTime)
    return (
      <div className="text-center text-neutral-400 py-12 text-lg">訂單資料異常，請聯絡客服</div>
    );

  let statusClass = "text-gray-600";
  switch (order.status) {
    case "paid":
      statusClass = "text-neutral-800 bg-green-100";
      break;
    case "pending":
      statusClass = "text-neutral-800 bg-primary-200";
      break;
    case "expired":
      statusClass = "text-neutral-500 bg-neutral-200";
      break;
    case "canceled":
      statusClass = "text-secondary-500 bg-secondary-100";
      break;
    case "used":
      statusClass = "text-white bg-neutral-400";
      break;
    case "processing":
      statusClass = "text-neutral-800 bg-primary-200";
      break;
    case "failed":
      statusClass = "text-neutral-800 bg-red-100";
      break;
    default:
      statusClass = "text-gray-600";
  }

  return (
    <Link
      href={`/attendee/orders/${order.id}`}
      className={`block w-full cursor-pointer mb-4 transition-shadow ${order.status === "canceled" || order.status === "expired" ? "bg-gray-100 text-gray-400" : "bg-white"}`}
    >
      <div
        className={`w-full transition-shadow bg-white flex items-center px-8 py-6 pr-16 border border-neutral-300 hover:border-neutral-800 ${order.status === "used" || order.status === "expired" ? "opacity-60" : ""}`}
      >
        <div className="w-full md:flex md:flex-row md:items-center">
          <div className="flex-shrink-0 flex items-center h-full mb-4 md:mb-0 order-1 md:order-2">
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusClass}`}>
              {orderStatusMap[order.status as keyof typeof orderStatusMap] ?? order.status}
            </span>
          </div>
          <div className="flex-1 min-w-0 flex items-center order-2 md:order-1">
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold mb-4">{order.activity.title}</div>
              <div className="md:flex items-center text-sm text-gray-600 mb-2 gap-6">
                <span className="flex items-center gap-1 mb-2 md:mb-0">
                  <CalendarIcon className="w-4 h-4" />
                  {formatEventDate(order.activity.startTime, order.activity.endTime).isSameDay ? (
                    `${formatEventDate(order.activity.startTime, order.activity.endTime).startDateString} ${formatEventDate(order.activity.startTime, order.activity.endTime).timeString}`
                  ) : (
                    <>
                      {
                        formatEventDate(order.activity.startTime, order.activity.endTime)
                          .startDateString
                      }{" "}
                      -{" "}
                      {
                        formatEventDate(order.activity.startTime, order.activity.endTime)
                          .endDateString
                      }
                    </>
                  )}
                </span>

                {order.activity.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {order.activity.location}
                  </span>
                )}
                {order.activity.isOnline && (
                  <span className="flex items-center gap-1">
                    <GlobeIcon className="w-4 h-4" />
                    線上活動
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mb-2">訂單編號：{order.id}</div>
              {order.status === "paid" && (
                <div className="text-sm text-gray-500">
                  付款方式：{order.payment?.method ?? "-"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
