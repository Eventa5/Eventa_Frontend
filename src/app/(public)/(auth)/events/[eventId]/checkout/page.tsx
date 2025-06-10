"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TicketCard } from "@/components/ui/ticket-card";
import {
  getApiV1ActivitiesByActivityId,
  getApiV1ActivitiesByActivityIdTicketTypes,
} from "@/services/api/client/sdk.gen";
import type { ActivityResponse, TicketTypeResponse } from "@/services/api/client/types.gen";
import { useAuthStore } from "@/store/auth";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
        <div className="flex flex-col md:flex-row gap-12 justify-center">
          {/* 左側活動資訊 */}
          <div className="w-full md:w-[440px] space-y-6 shrink-0">
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

          {/* 右側票券選擇 */}
          <div className="w-full md:w-[640px] space-y-6 shrink-0">
            <div className="text-md font-bold">請選擇票種</div>
            <div className="w-full">
              <Select defaultValue="1">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">場次一：04/19（六）</SelectItem>
                  <SelectItem value="2">場次二：04/20（日）</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
