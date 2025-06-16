"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TicketCard } from "@/components/ui/ticket-card";
import CancelOrderDialog from "@/features/orders/components/cancel-order-dialog";
import {
  getApiV1ActivitiesByActivityId,
  getApiV1ActivitiesByActivityIdTicketTypes,
  patchApiV1OrdersByOrderIdCancel,
  postApiV1Orders,
  postApiV1OrdersByOrderIdCheckout,
} from "@/services/api/client/sdk.gen";
import type {
  ActivityResponse,
  CreateOrderResponse,
  TicketTypeResponse,
} from "@/services/api/client/types.gen";
import { useAuthStore } from "@/store/auth";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// 定義票券資料類型
interface TicketState {
  quantity: number;
}

export default function CheckoutPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [focusedTicketId, setFocusedTicketId] = useState<string | null>(null);
  const [ticketStates, setTicketStates] = useState<Record<string, TicketState>>({});

  const [eventData, setEventData] = useState<ActivityResponse | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);

  const totalQuantity = Object.values(ticketStates).reduce((sum, state) => sum + state.quantity, 0);
  const totalPrice = ticketTypes.reduce((sum, ticket) => {
    const ticketId = ticket.id?.toString() ?? "";
    const quantity = ticketStates[ticketId]?.quantity ?? 0;
    return sum + quantity * (ticket.price ?? 0);
  }, 0);

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setTicketStates((prev) => ({
      ...prev,
      [ticketId]: { quantity },
    }));
  };

  const handleCheckout = (orderId: string) => {
    postApiV1OrdersByOrderIdCheckout({
      path: { orderId },
    }).then((res) => {
      if (res.data) {
        // 建立一個 div，插入 form
        const div = document.createElement("div");
        div.innerHTML = res.data;
        document.body.appendChild(div);

        // 自動送出 form
        const form = div.querySelector("form");
        if (form) {
          (form as HTMLFormElement).submit();
        }
      }
    });
  };

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    getApiV1ActivitiesByActivityId({
      path: { activityId: Number(eventId) },
    })
      .then((res) => {
        setEventData(res.data?.data ?? null);
        if (!res.data?.data) setError("查無此活動");
      })
      .catch(() => setError("載入活動資料失敗"))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    getApiV1ActivitiesByActivityIdTicketTypes({
      path: { activityId: Number(eventId) },
    })
      .then((res) => {
        setTicketTypes(res.data?.data ?? []);
      })
      .catch(() => {
        setTicketTypes([]);
      });
  }, [eventId]);
  if (!isAuthenticated) return null;

  return loading ? (
    // 載入中
    <div className="min-h-screen flex items-center justify-center bg-primary-50 -mt-10">
      <Loader className="animate-spin w-10 h-10 text-primary-500" />
    </div>
  ) : error ? (
    // 錯誤頁面顯示
    <div className="min-h-screen flex flex-col items-center justify-center text-2xl font-bold text-neutral-500 bg-primary-50 -mt-10">
      {error}
      <Image
        src="/images/error.png"
        alt="error"
        width={400}
        height={400}
      />
    </div>
  ) : (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12 justify-center">
          {/* 活動資訊 */}
          <div className="w-full lg:flex-1 lg:max-w-[400px] xl:w-[440px] xl:flex-none space-y-6 shrink-0">
            <div className="relative h-[280px] w-full overflow-hidden rounded-lg">
              <Image
                src={eventData?.cover ? eventData.cover : "/images/no_single_activity_cover.png"}
                alt={eventData?.title ?? "無標題"}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold mb-10 font-serif-tc">
                  {eventData?.title ?? "無標題"}
                </h1>
                <div className="space-y-4">
                  <span className="text-lg font-semibold">活動時間</span>
                  <p className="text-sm text-muted-foreground">
                    {eventData?.startTime
                      ? format(eventData.startTime, "yyyy.MM.dd (E) HH:mm", {
                          locale: zhTW,
                        }).replace("週", "")
                      : "--"}
                    -
                    {eventData?.endTime
                      ? format(eventData.endTime, "MM.dd (E) HH:mm", {
                          locale: zhTW,
                        }).replace("週", "")
                      : "--"}
                    (GMT+8)
                  </p>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <span className="text-lg font-semibold">活動地點</span>
                  <p className="text-sm text-muted-foreground">{eventData?.location ?? "--"}</p>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <span className="text-lg font-semibold">退票規則</span>
                  <p className="text-sm text-muted-foreground">
                    本活動委託 Eventa 代為處理退款事宜，依退款規則辦理。如需申請退款請於「購買成功
                    24 小時後，並於活動票券有效開始日前 8 日」辦理，並將酌收票價 10%
                    退票手續費，逾期恕不受理。
                  </p>
                  <Button
                    variant="link"
                    className="flex items-center gap-2 text-[#b39340] p-0 h-auto font-bold"
                  >
                    如何辦理退款
                  </Button>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <span className="text-lg font-semibold">購票須知</span>
                  <p className="text-sm text-muted-foreground">
                    請注意，你應該先報名完成一筆訂單後再報名下一筆。為保障消費者權益及杜絕非法囤票，同一使用者同時間只能報名一筆訂單，透過多開視窗同時報名、購買多筆訂單，系統將只保留最後一筆訂單，取消先前尚未報名完成之訂單，敬請理解與配合。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 訂單確認 */}
          <div
            className={`w-full lg:flex-1 lg:max-w-[500px] xl:w-[640px] xl:flex-none space-y-6 shrink-0
              ${orderCreated ? "" : "hidden"}
              `}
          >
            {/* 訂單明細表格 */}
            <div className="mt-6">
              {/* 手機版 - 垂直卡片顯示 */}
              <div className="md:hidden space-y-4">
                {orderData?.orderItems?.map((ticket) => (
                  <div
                    key={`${ticket.ticketType?.name}-${ticket.ticketType?.price}-${ticket.quantity}`}
                    className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    <div className="font-bold text-left">
                      {ticket.ticketType?.name}
                      <div className="text-xs text-neutral-400 font-normal mt-1">
                        票券可用時間
                        <br />
                        {format(ticket.ticketType?.startTime ?? "", "yyyy.MM.dd (EEE) HH:mm", {
                          locale: zhTW,
                        }).replace("週", "")}
                        -
                        {format(ticket.ticketType?.endTime ?? "", "MM.dd (EEE) HH:mm", {
                          locale: zhTW,
                        }).replace("週", "")}
                        (GMT+8)
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">數量</span>
                      <span className="font-medium">{ticket.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">單價</span>
                      <span className="font-medium">
                        NT${ticket.ticketType?.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">小計</span>
                      <span className="font-bold text-lg">
                        NT$
                        {(ticket.ticketType?.price ?? 0) * (ticket?.quantity ?? 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 桌面版 - 表格顯示 */}
              <div className="hidden md:block border rounded-sm border-gray-200 overflow-hidden">
                <table className="w-full text-center">
                  <thead className="bg-neutral-700 text-white">
                    <tr>
                      <th className="py-3 font-bold">項目</th>
                      <th className="py-3 font-bold">數量</th>
                      <th className="py-3 font-bold">價格</th>
                      <th className="py-3 font-bold">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData?.orderItems?.map((ticket) => (
                      <tr
                        key={`${ticket.ticketType?.name}-${ticket.ticketType?.price}-${ticket.quantity}`}
                        className="border-t border-gray-200"
                      >
                        <td className="py-4 font-bold text-left pl-6">
                          {ticket.ticketType?.name}
                          <div className="text-xs text-neutral-400 font-normal mt-1">
                            票券可用時間
                            <br />
                            {format(ticket.ticketType?.startTime ?? "", "yyyy.MM.dd (EEE) HH:mm", {
                              locale: zhTW,
                            }).replace("週", "")}
                            -
                            {format(ticket.ticketType?.endTime ?? "", "MM.dd (EEE) HH:mm", {
                              locale: zhTW,
                            }).replace("週", "")}
                            (GMT+8)
                          </div>
                        </td>
                        <td className="py-4">{ticket.quantity}</td>
                        <td className="py-4">NT${ticket.ticketType?.price?.toLocaleString()}</td>
                        <td className="py-4">
                          NT$
                          {(ticket.ticketType?.price ?? 0) * (ticket?.quantity ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex-1 py-4 flex flex-col items-end">
              <div className="flex items-end">
                <span className="font-bold text-lg tracking-wide mr-4">付款金額</span>
                <span className="font-bold text-lg tracking-wide">
                  NT$ {orderData?.payment?.paidAmount?.toLocaleString()}
                </span>
              </div>
              {totalPrice > 0 && !!orderData?.paidExpiredAt && (
                <div className="text-sm text-neutral-700 mt-1">
                  付款期限：
                  {format(new Date(orderData?.paidExpiredAt as string), "yyyy.MM.dd  HH:mm")}
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-8">
              <Button
                variant="outline"
                className="w-full md:flex-1 font-semibold"
                onClick={() => {
                  setShowCancelOrderDialog(true);
                }}
              >
                上一步
              </Button>
              <CancelOrderDialog
                isOpen={showCancelOrderDialog}
                onClose={() => setShowCancelOrderDialog(false)}
                onConfirm={() => {
                  patchApiV1OrdersByOrderIdCancel({
                    path: { orderId: orderData?.id ?? "" },
                  });
                  setOrderCreated(false);
                  setShowCancelOrderDialog(false);
                }}
                orderId={orderData?.id ?? ""}
              />
              {totalPrice > 0 ? (
                <Button
                  className="w-full md:flex-1 font-semibold bg-neutral-700 text-white hover:bg-neutral-800"
                  onClick={() => {
                    handleCheckout(orderData?.id ?? "");
                  }}
                >
                  前往付款
                </Button>
              ) : (
                <Link
                  href={`/attendee/orders/${orderData?.id}`}
                  className="w-full md:flex-1 font-semibold bg-neutral-700 text-white hover:bg-neutral-800 rounded-md py-2 px-4 text-center text-sm"
                >
                  前往訂單管理查看票券
                </Link>
              )}
            </div>
          </div>
          {/* 票券選擇 */}
          <div
            className={`w-full lg:flex-1 lg:max-w-[500px] xl:w-[640px] xl:flex-none space-y-6 shrink-0 ${
              orderCreated ? "hidden" : ""
            }`}
          >
            <div className="text-md font-bold">請選擇票券</div>
            {ticketTypes.map((ticket) => {
              const ticketId = ticket.id?.toString() ?? "";
              return (
                <TicketCard
                  key={ticketId}
                  {...ticket}
                  isFocused={focusedTicketId === ticketId}
                  onQuantityFocus={() => setFocusedTicketId(ticketId)}
                  onQuantityBlur={() => setFocusedTicketId(null)}
                  onQuantityChange={(quantity) => handleQuantityChange(ticketId, quantity)}
                />
              );
            })}
            <div className="space-y-4">
              <span className="block text-right text-lg font-semibold">
                {totalQuantity} 張票，總計 NT$ {totalPrice.toLocaleString()}
              </span>
              <Button
                className="w-full font-semibold"
                size="lg"
                disabled={totalQuantity === 0}
                onClick={async () => {
                  try {
                    const orderBody = {
                      activityId: Number(eventId),
                      tickets: Object.entries(ticketStates)
                        .filter(([_, state]) => state.quantity > 0)
                        .map(([ticketId, state]) => ({
                          id: Number(ticketId),
                          quantity: state.quantity,
                        })),
                      paidAmount: totalPrice,
                      commonlyUsedInvoicesId: null,
                      ticket: {
                        invoiceAddress: "",
                        invoiceReceiverName: "",
                        invoiceReceiverPhoneNumber: "",
                        invoiceReceiverEmail: "",
                        invoiceTaxId: "",
                        invoiceTitle: "",
                        invoiceCarrier: "",
                        invoiceType: "b2c",
                      },
                    };
                    const res = await postApiV1Orders({ body: orderBody });
                    if (res?.data?.data) {
                      setOrderData(res?.data?.data ?? null);
                      toast.success("訂單建立成功！");
                      setOrderCreated(true);
                    }
                  } catch (e: any) {
                    toast.error(e?.message || "訂單建立失敗，請稍後再試");
                  }
                }}
              >
                立即報名
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
