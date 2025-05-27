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
import { Separator } from "@/components/ui/separator";
import { Ticket, getTicketStatusColor, mockTickets } from "@/features/orders/orderDetail";
import {
  getApiV1Activities,
  getApiV1ActivitiesByActivityId,
  getApiV1UsersProfile,
} from "@/services/api/client/sdk.gen";
import type { ActivityResponse, UserResponse } from "@/services/api/client/types.gen";
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
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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

export default function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = useParams();

  // 使用 useSWR 獲取活動資料
  const {
    data: activity,
    error: activityError,
    isLoading: activityLoading,
  } = useSWR<ActivityResponse>(
    // TODO: 從訂單資料中獲取活動 ID
    "/api/activities/1",
    () => activityFetcher(1)
  );

  // 使用 useSWR 獲取個人資料
  const {
    data: userProfile,
    error: profileError,
    isLoading: profileLoading,
  } = useSWR<UserResponse>("/api/users/profile", profileFetcher);

  // 使用 useSWR 獲取相似活動資料
  const { data: similarActivities } = useSWR(
    activity?.categories?.map((cat) => cat.id),
    similarActivitiesFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // 假資料
  const order = {
    id: "2022121720571882545141",
    status: "待付款",
    payType: "－",
    totalPrice: "1,000",
  };

  const handleViewSimilarActivities = () => {
    if (activity?.categories?.length) {
      const categoryName = activity.categories[0].name;
      router.push(`/events?category=${categoryName}`);
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/events?search=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (categoryName: string | undefined) => {
    if (categoryName) {
      router.push(`/events?category=${categoryName}`);
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

  const genderMap = {
    male: "男",
    female: "女",
    nonBinary: "其他",
  };

  const mockTags = ["文青最愛", "聽團仔"];

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
                  className="bg-secondary-100 text-secondary-500 px-4 md:px-6 py-1 md:py-2 rounded-lg text-sm md:text-lg font-semibold cursor-pointer hover:bg-secondary-200 transition-colors"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.name}
                </span>
              ))}
              <span
                className="bg-secondary-100 text-secondary-500 px-4 md:px-6 py-1 md:py-2 rounded-lg text-sm md:text-lg font-semibold cursor-pointer hover:bg-secondary-200 transition-colors"
                onClick={() => handleCategoryClick(activity?.isOnline ? "線上活動" : "線下活動")}
              >
                {" "}
                {activity?.isOnline ? "線上活動" : "線下活動"}
              </span>
            </div>
            <div className="md:flex mb-4 items-center gap-2">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-2 font-serif-tc">
                {activity.title}
              </h2>
              <Button
                type="button"
                className="px-4 py-1 rounded mr-2 bg-primary-300"
                onClick={handleViewSimilarActivities}
              >
                查看類似活動
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-6 md:mb-16">
              {mockTags.map((tag) => (
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
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
                  <Info className="w-6 h-6 text-neutral-500" />
                  訂單資訊
                </h3>

                <ul className="text-neutral-800 text-base">
                  <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                    <Hash className="w-6 h-6 text-neutral-500" />
                    <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                      <p className="font-semibold md:w-1/5 md:mb-0 mb-2">訂單編號</p>
                      <div className="md:w-4/5">{orderId}</div>
                    </div>
                  </li>
                  <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                    <Receipt className="w-6 h-6 text-neutral-500" />
                    <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                      <p className="font-semibold md:w-1/5 md:mb-0 mb-2">總價</p>
                      <div className="flex md:w-4/5 gap-2 items-center text-xl font-bold">
                        {order.totalPrice} 元
                      </div>
                    </div>
                  </li>
                  <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                    <CreditCard className="w-6 h-6 text-neutral-500" />
                    <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                      <p className="font-semibold md:w-1/5 md:mb-0 mb-2">付款方式</p>
                      <div className="flex md:w-4/5 gap-2 items-center">{order.payType}</div>
                    </div>
                  </li>
                  <li className="flex item-start md:items-center gap-3 md:w-full">
                    <Calendar className="w-6 h-6 text-neutral-500" />
                    <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                      <p className="font-semibold md:w-1/5 md:mb-0 mb-2">訂單狀態</p>
                      <div className="flex md:w-4/5 gap-2 items-center">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium ${statusClass}`}
                        >
                          {order.status}
                        </span>
                        {order.status === "待付款" && (
                          <>
                            <Button
                              type="button"
                              className="px-4 py-1 rounded mr-2 font-semibold"
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
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
                  <Info className="w-6 h-6 text-neutral-500" />
                  參加者資訊
                </h3>

                <div>
                  <ul className="mb-6">
                    <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                      <User className="w-6 h-6 text-neutral-500 mt-1" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">姓名</p>
                        <div className="flex md:w-4/5 gap-2 items-center">{userProfile?.name}</div>
                      </div>
                    </li>
                    <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                      <Mail className="w-6 h-6 text-neutral-500 mt-1" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">電子郵件</p>
                        <div className="flex md:w-4/5 gap-2 items-center">{userProfile?.email}</div>
                      </div>
                    </li>
                    <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                      <Phone className="w-6 h-6 text-neutral-500 mt-1" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">行動電話</p>
                        <div className="flex md:w-4/5 gap-2 items-center">
                          {userProfile?.phoneNumber}
                        </div>
                      </div>
                    </li>
                    <li className="mb-4 flex item-start md:items-center gap-3 md:w-full">
                      <User className="w-6 h-6 text-neutral-500 mt-1" />
                      <div className="space-y-1 md:grow-1 md:flex items-center gap-2">
                        <p className="font-semibold md:w-1/5 md:mb-0 mb-2">性別</p>
                        <div className="flex md:w-4/5 gap-2 items-center">
                          {genderMap[userProfile?.gender as keyof typeof genderMap]}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mb-16 md:mb-32">
        <h3 className="flex items-center gap-2 text-2xl font-semibold leading-[1.2] font-serif-tc mb-6">
          <TicketIcon className="w-5 h-5 md:w-6 md:h-6 text-neutral-500" />
          訂單票券
        </h3>

        {/* 票券卡片 */}
        {mockTickets.map((ticket, idx) => {
          const statusColor = getTicketStatusColor(ticket.status);
          return (
            <Card
              key={ticket.id}
              className="mb-4 border-neutral-300"
            >
              <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 md:p-8">
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-bold mb-2 md:mb-4">{ticket.name}</div>
                  <div className="text-sm mb-1 text-neutral-600">票券編號：{ticket.id}</div>
                  <div className="text-sm mb-1 text-neutral-600">
                    有效期限：{ticket.startTime?.slice(0, 10)} {ticket.startTime?.slice(11, 16)} ~{" "}
                    {ticket.endTime?.slice(11, 16)}
                  </div>
                  <div className="text-sm mb-1 text-neutral-600">
                    票價：<span className="font-semibold">{ticket.price.toLocaleString()} 元</span>
                  </div>
                  <div className="text-sm mb-1 text-neutral-600">
                    票券持有者：
                    {ticket.assignedName
                      ? `${ticket.assignedName}${ticket.assignedEmail ? `, ${ticket.assignedEmail}` : ""}`
                      : "－"}
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2 min-w-[120px]">
                  {ticket.status && (
                    <span
                      className={`border px-6 py-2 rounded-full text-sm mb-2 text-center ${statusColor}`}
                    >
                      {ticket.status}
                    </span>
                  )}
                  {/* 狀態按鈕區塊 */}
                  {!["已取消", "已逾期", "已使用"].includes(ticket.status) ? (
                    <div className="flex md:flex-col items-center md:items-stretch gap-2">
                      <Button
                        type="button"
                        className="px-6 py-2 rounded"
                        onClick={() => router.push(`/attendee/tickets/${ticket.id}`)}
                      >
                        查看票券
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-neutral-300 text-neutral-600 px-6 py-2 rounded hover:bg-neutral-400 hover:text-white w-[120px] md:w-auto block"
                        onClick={() => router.push(`/attendee/orders/${orderId}/refund`)}
                      >
                        退票
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
