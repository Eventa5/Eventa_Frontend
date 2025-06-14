"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventCard } from "@/components/ui/event-cards";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEventDate } from "@/features/activities/formatEventDate";
import RefundConfirmDialog from "@/features/orders/components/refund-confirm-dialog";
import RefundFailDialog from "@/features/orders/components/refund-fail-dialog";
import RefundSuccessDialog from "@/features/orders/components/refund-success-dialog";
import {
  getTicketStatusColor,
  orderStatusMap,
  ticketStatusMap,
} from "@/features/orders/orderDetail";
import {
  getApiV1Activities,
  getApiV1ActivitiesByActivityId,
  getApiV1OrdersByOrderId,
  getApiV1UsersProfile,
} from "@/services/api/client/sdk.gen";
import type { ActivityResponse, OrderDetailResponse } from "@/services/api/client/types.gen";
import {
  Calendar,
  CreditCard,
  Hash,
  Info,
  Mail,
  Phone,
  Receipt,
  Ticket as TicketIcon,
  User,
  VenusAndMars,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const activityFetcher = async (activityId: number) => {
  const response = await getApiV1ActivitiesByActivityId({
    path: { activityId },
  });
  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.error?.message || "無法獲取活動資料");
};

const profileFetcher = async () => {
  const response = await getApiV1UsersProfile();
  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.error?.message || "無法獲取個人資料");
};

const similarActivitiesFetcher = async (categoryIds: number[]) => {
  const response = await getApiV1Activities({
    query: {
      categoryId: categoryIds[0],
      page: 1,
      limit: 3,
    },
  });
  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.error?.message || "無法獲取相似活動資料");
};

const orderFetcher = async (orderId: string) => {
  const response = await getApiV1OrdersByOrderId({
    path: { orderId },
  });
  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error(response.error?.message || "無法獲取訂單資料");
};

export default function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [showRefundSuccess, setShowRefundSuccess] = useState(false);
  const [showRefundFail, setShowRefundFail] = useState(false);
  const [refundResult, setRefundResult] = useState<{
    activityName: string;
    cancelTime: string;
  } | null>(null);
  const [showSimilarActivities, setShowSimilarActivities] = useState(false);

  // 使用 useSWR 獲取訂單資料
  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
  } = useSWR<OrderDetailResponse>(orderId ? `/api/orders/${orderId}` : null, () =>
    orderFetcher(orderId as string)
  );

  // 使用 useSWR 獲取活動資料
  const {
    data: activity,
    error: activityError,
    isLoading: activityLoading,
  } = useSWR<ActivityResponse>(order?.activity?.title ? `/api/activities/${order.id}` : null, () =>
    activityFetcher(Number((order?.activity as { id?: number })?.id))
  );

  // 使用 useSWR 獲取相似活動資料
  const { data: similarActivities } = useSWR(
    order?.activity?.categories?.map((cat) => cat.id),
    similarActivitiesFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const handleViewSimilarActivities = () => {
    setShowSimilarActivities(true);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/events?search=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (categoryName: string | undefined) => {
    if (categoryName) {
      router.push(`/events?category=${categoryName}`);
    }
  };

  const genderMap = {
    male: "男",
    female: "女",
    nonBinary: "其他",
  };

  const mockTags = ["文青最愛", "聽團仔"];

  // 退票流程
  const handleRefund = async () => {
    setShowRefundConfirm(false);
    try {
      // const res = await refundApiCall(orderId); // 實際請求
      // 假設回傳 { activityName: activity?.title, cancelTime: new Date().toLocaleString() }
      const res = { activityName: activity?.title ?? "", cancelTime: new Date().toLocaleString() };
      setRefundResult(res);
      // setShowRefundSuccess(true);
      setShowRefundFail(true);
    } catch (e) {
      setShowRefundFail(true);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 pt-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/attendee/orders">訂單管理</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{`訂單詳情（${orderId}）`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">訂單詳情</h1>

      {orderLoading ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左側主內容 */}
          <div className="flex-1 min-w-0">
            {/* 標籤列 */}
            <div className="flex gap-2 mb-6">
              {["category-1", "category-2", "category-3"].map((key) => (
                <Skeleton
                  key={key}
                  className="h-8 w-24 rounded-lg"
                />
              ))}
            </div>

            {/* 活動標題 */}
            <div className="md:flex mb-4 items-center gap-2">
              <Skeleton className="h-12 w-3/4 mb-2" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* 標籤 */}
            <div className="flex items-center gap-2 mb-6 md:mb-16">
              {["tag-1", "tag-2"].map((key) => (
                <Skeleton
                  key={key}
                  className="h-6 w-20 rounded-full"
                />
              ))}
            </div>

            {/* 訂單資訊 */}
            <div>
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-neutral-500" />
                  訂單資訊
                </h3>

                <ul className="text-neutral-800 text-base">
                  {["order-id", "order-amount", "payment-method", "order-status"].map((key) => (
                    <li
                      key={key}
                      className="mb-4 flex item-start md:items-center gap-3 md:w-full"
                    >
                      <Skeleton className="w-5 h-5 md:w-6 md:h-6" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-neutral-500" />
                  參加者資訊
                </h3>

                <div>
                  <ul className="mb-6">
                    {["user-name", "user-email", "user-phone", "user-gender"].map((key) => (
                      <li
                        key={key}
                        className="mb-4 flex item-start md:items-center gap-3 md:w-full"
                      >
                        <Skeleton className="w-5 h-5 md:w-6 md:h-6" />
                        <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : orderError ? (
        <div className="text-center py-12 text-lg">載入失敗：{orderError.message}</div>
      ) : (
        order && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* 左側主內容 */}
            <div className="flex-1 min-w-0">
              {/* 標籤列 */}
              <div className="flex gap-2 mb-6">
                {order?.activity?.categories?.map((category) => (
                  <span
                    key={category.id}
                    className="bg-secondary-100 text-secondary-500 px-4 md:px-6 py-1 md:py-2 rounded-lg text-sm md:text-lg font-semibold cursor-pointer hover:bg-secondary-200 transition-colors"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name}
                  </span>
                ))}
                {/* <span
                  className="bg-secondary-100 text-secondary-500 px-4 md:px-6 py-1 md:py-2 rounded-lg text-sm md:text-lg font-semibold cursor-pointer hover:bg-secondary-200 transition-colors"
                  onClick={() => handleCategoryClick(activity?.isOnline ? "線上活動" : "線下活動")}
                >
                  {activity?.isOnline ? "線上活動" : "線下活動"}
                </span> */}
              </div>
              <div className="md:flex mb-4 items-center gap-4">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-2 font-serif-tc">
                  {order?.activity?.title}
                </h2>
                {similarActivities && similarActivities.length > 0 && (
                  <Button
                    type="button"
                    className="px-4 py-1 rounded mr-2 bg-primary-300"
                    onClick={handleViewSimilarActivities}
                  >
                    查看類似活動
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 mb-6 md:mb-16">
                {order?.activity?.tags?.split(",").map((tag: string) => (
                  <Badge
                    variant="outline"
                    key={tag}
                    className="rounded-full px-4 py-1 cursor-pointer hover:bg-neutral-100 text-sm"
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div>
                <div>
                  <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
                    <Info className="w-5 h-5 md:w-6 md:h-6 text-neutral-500" />
                    訂單資訊
                  </h3>

                  <ul className="text-neutral-800 text-base">
                    <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                      <Hash className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-0.5 md:mt-0 shrink-0" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">訂單編號</p>
                        <div className="md:w-4/5">{order.id}</div>
                      </div>
                    </li>
                    <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                      <Receipt className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-0.5 md:mt-0 shrink-0" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">總價</p>
                        <div className="flex md:w-4/5 gap-2 items-center text-xl font-bold">
                          {order.payment?.paidAmount?.toLocaleString()} 元
                        </div>
                      </div>
                    </li>
                    <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                      <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-0.5 md:mt-0 shrink-0" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">付款方式</p>
                        <div className="flex md:w-4/5 gap-2 items-center">
                          {order.payment?.method || "－"}
                        </div>
                      </div>
                    </li>
                    <li className="flex item-start md:items-center gap-3 md:w-full">
                      <Calendar className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-0.5 md:mt-0 shrink-0" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">訂單狀態</p>
                        <div className="md:flex md:w-4/5 gap-2 items-center">
                          <span className="inline-block py-1 rounded-full font-medium mb-2 md:mb-0">
                            {orderStatusMap[order.status as keyof typeof orderStatusMap]}
                          </span>
                          <div>
                            {order.status === "pending" && (
                              <>
                                <Button
                                  type="button"
                                  className="py-2 md:py-2.5 rounded mr-2 font-semibold h-auto w-[120px] mb-2 sm:mb-0"
                                  onClick={() => {
                                    const activityId = (order.activity as { id?: number })?.id;
                                    if (activityId) {
                                      router.push(
                                        `/events/${activityId}/checkout?orderId=${order.id}`
                                      );
                                    }
                                  }}
                                >
                                  前往付款
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="border-neutral-300 text-neutral-600 py-2 md:py-2.5 rounded hover:bg-neutral-400 hover:text-white w-[120px] h-auto"
                                  onClick={() => setShowRefundConfirm(true)}
                                >
                                  退票
                                </Button>
                              </>
                            )}
                            {order.status === "paid" && (
                              <Button
                                type="button"
                                variant="outline"
                                className="border-neutral-300 text-neutral-600 py-2 md:py-2.5 rounded hover:bg-neutral-400 hover:text-white w-[120px] h-auto"
                                onClick={() => setShowRefundConfirm(true)}
                              >
                                退票
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
                    <Info className="w-5 h-5 md:w-6 md:h-6 text-neutral-500" />
                    參加者資訊
                  </h3>

                  <div>
                    <ul className="mb-6">
                      <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                        <User className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-1" />
                        <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                          <p className="font-semibold md:w-1/5 md:mb-0 mb-2">姓名</p>
                          <div className="flex md:w-4/5 gap-2 items-center">
                            {order?.user?.name}
                          </div>
                        </div>
                      </li>
                      <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                        <Mail className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-1" />
                        <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                          <p className="font-semibold md:w-1/5 md:mb-0 mb-2">電子郵件</p>
                          <div className="flex md:w-4/5 gap-2 items-center">
                            {order?.user?.email}
                          </div>
                        </div>
                      </li>
                      <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                        <Phone className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-1" />
                        <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                          <p className="font-semibold md:w-1/5 md:mb-0 mb-2">行動電話</p>
                          <div className="flex md:w-4/5 gap-2 items-center">
                            {order?.user?.phoneNumber}
                          </div>
                        </div>
                      </li>
                      <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                        <VenusAndMars className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 mt-1" />
                        <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                          <p className="font-semibold md:w-1/5 md:mb-0 mb-2">性別</p>
                          <div className="flex md:w-4/5 gap-2 items-center">
                            {genderMap[order?.user?.gender as keyof typeof genderMap]}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {!orderError && (
        <>
          <Separator className="my-4" />
          <div className="mb-16 md:mb-32">
            <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
              <TicketIcon className="w-5 h-5 md:w-6 md:h-6 text-neutral-500" />
              訂單票券
            </h3>

            {orderLoading
              ? // 票券卡片骨架
                ["ticket-1", "ticket-2"].map((key) => (
                  <Card
                    key={key}
                    className="mb-4 border-neutral-300"
                  >
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 md:p-8">
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex flex-col md:items-end gap-2 min-w-[120px]">
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : order?.tickets?.map((ticket) => {
                  const statusColor = getTicketStatusColor(ticket.status || "");
                  return (
                    <Card
                      key={ticket.id}
                      className="mb-4 border-neutral-300"
                    >
                      <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 md:p-8">
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold mb-2 md:mb-4">
                            {ticket.ticketType?.name}
                          </div>
                          <div className="text-sm mb-1 text-neutral-600">票券編號：{ticket.id}</div>
                          <div className="text-sm mb-1 text-neutral-600">
                            付款有效期限：
                            {
                              formatEventDate(
                                order?.paidExpiredAt || "",
                                order?.paidExpiredAt || ""
                              ).startDateString
                            }{" "}
                            23:59
                          </div>
                          <div className="text-sm mb-1 text-neutral-600">
                            票價：
                            <span className="font-semibold">
                              {ticket.ticketType?.price?.toLocaleString()} 元
                            </span>
                          </div>
                          {/* <div className="text-sm mb-1 text-neutral-600">
                        票券持有者：
                        {ticket.assignedName
                          ? `${ticket.assignedName}${ticket.assignedEmail ? `, ${ticket.assignedEmail}` : ""}`
                          : "－"}
                      </div> */}
                        </div>
                        <div className="flex flex-col md:items-end gap-2 min-w-[120px]">
                          {ticket.status && (
                            <span
                              className={`border px-4 py-1 md:px-6 md:py-2 rounded-full text-sm mb-2 text-center ${statusColor}`}
                            >
                              {ticketStatusMap[ticket.status as keyof typeof ticketStatusMap]}
                            </span>
                          )}
                          {/* 狀態按鈕區塊 */}
                          {!["已取消", "已逾期", "已使用"].includes(ticket.status || "") ? (
                            <div className="flex md:flex-col items-center md:items-stretch gap-2">
                              <Button
                                type="button"
                                className="px-6 py-2 md:px-8 md:py-2.5 rounded w-[120px] md:w-auto h-auto"
                                onClick={() => router.push(`/attendee/tickets/${ticket.id}`)}
                              >
                                查看票券
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </>
      )}
      <RefundConfirmDialog
        open={showRefundConfirm}
        onConfirm={handleRefund}
        onCancel={() => setShowRefundConfirm(false)}
      />
      <RefundSuccessDialog
        open={showRefundSuccess}
        onClose={() => {
          setShowRefundSuccess(false);
        }}
        activityName={refundResult?.activityName}
        cancelTime={refundResult?.cancelTime}
      />
      <RefundFailDialog
        open={showRefundFail}
        onClose={() => setShowRefundFail(false)}
      />

      {/* 推薦活動彈窗 */}
      <Dialog
        open={showSimilarActivities}
        onOpenChange={setShowSimilarActivities}
      >
        <DialogContent className="max-w-3xl border-neutral-300 bg-primary-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              <DialogDescription>推薦活動</DialogDescription>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-h-[80vh] overflow-y-auto">
            {similarActivities?.map((activity) => (
              <EventCard
                key={activity.id}
                id={activity.id?.toString() || ""}
                title={activity.title || ""}
                location={activity.location || ""}
                date={formatEventDate(activity.startTime || "", activity.endTime || "")}
                imageUrl={activity.cover || ""}
                size="sm"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
