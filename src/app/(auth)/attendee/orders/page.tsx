"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { OrderTabsValue } from "@/components/ui/order-tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import type { DateRange } from "react-day-picker";
const OrderTabs = dynamic(() => import("@/components/ui/order-tabs"), { ssr: false });

type Order = {
  id: string;
  title: string;
  date: string;
  status: string;
  location: string;
  payType: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const orders = [
    {
      id: "2022121720571882545141",
      title: "復古黑膠派對之夜",
      date: "2025.05.10 (六) 20:00 - 23:30",
      status: "待付款",
      location: "台北市",
      payType: "－",
    },
    {
      id: "2306290719154650173170",
      title: "未來藝術家｜跨界表演藝術節",
      date: "2025.05.10 (六) 18:00 - 21:00",
      status: "已付款",
      location: "新北市",
      payType: "LINE Pay",
    },
    {
      id: "2312080802109488660540",
      title: "型動美學｜街頭時尚攝影展覽",
      date: "2025.04.22 (六) 10:00 - 05.02 (日) 18:00",
      status: "待付款",
      location: "新北市",
      payType: "LINE Pay",
    },
    {
      id: "2406121656521032659303",
      title: "歡樂島音樂大冒險：烏克麗麗 × 手風琴 × 小小DJ",
      date: "2025.04.05 (六) 13:00 - 04.06 (日) 17:00",
      status: "已逾期",
      location: "台北市",
      payType: "-",
    },
  ];

  // 狀態對應
  const statusMap: Record<OrderTabsValue, string[]> = {
    all: [],
    registered: ["已付款"],
    pending: ["待付款"],
    cancelled: ["已取消"],
    expired: ["已逾期"],
  };

  // 計算各狀態數量
  const counts = {
    all: orders.length,
    registered: orders.filter((o) => o.status === "已付款").length,
    pending: orders.filter((o) => o.status === "待付款").length,
    cancelled: orders.filter((o) => o.status === "已取消").length,
    expired: orders.filter((o) => o.status === "已逾期").length,
  };

  const [tab, setTab] = React.useState<OrderTabsValue>("all");
  const [search, setSearch] = React.useState("");
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(today.getDate() - 30);
  const [searchDate, setSearchDate] = React.useState<DateRange | undefined>({
    from: oneMonthAgo,
    to: today,
  });
  const [visibleCount, setVisibleCount] = React.useState(10);

  // 依年月分組
  function groupOrdersByYearMonth(orders: Order[]) {
    return orders.reduce<Record<string, Order[]>>((acc, order) => {
      const [year, month] = order.date.split(".");
      const key = `${year}-${month}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {});
  }

  // 依 tab 狀態過濾訂單
  const filteredOrders =
    tab === "all" ? orders : orders.filter((o) => statusMap[tab].includes(o.status));

  const grouped = groupOrdersByYearMonth(filteredOrders);
  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">訂單管理</h1>
      <OrderTabs
        value={tab}
        onValueChange={setTab}
        counts={counts}
        className="mb-4 border-b border-neutral-300"
      />
      <form
        className="flex flex-col md:flex-row gap-2 mb-6 items-center"
        onSubmit={(e) => {
          e.preventDefault(); /* TODO: implement search */
        }}
      >
        <Input
          className="w-full md:w-1/3"
          placeholder="搜尋活動"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-full md:w-1/4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={"w-full justify-start text-left font-normal"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchDate?.from ? (
                  searchDate.to ? (
                    <>
                      {searchDate.from.toISOString().slice(0, 10)} -{" "}
                      {searchDate.to.toISOString().slice(0, 10)}
                    </>
                  ) : (
                    searchDate.from.toISOString().slice(0, 10)
                  )
                ) : (
                  <span>搜尋日期區間</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="range"
                defaultMonth={searchDate?.from}
                selected={searchDate}
                onSelect={setSearchDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          type="submit"
          className="w-full md:w-auto"
        >
          搜尋
        </Button>
      </form>

      {/* 依年月分組顯示訂單 */}
      {(() => {
        const allOrders: Order[] = sortedKeys.flatMap((key) => grouped[key]);
        const visibleOrders = allOrders.slice(0, visibleCount);
        const visibleGrouped = groupOrdersByYearMonth(visibleOrders);
        const visibleKeys = Object.keys(visibleGrouped).sort((a, b) => b.localeCompare(a));
        return (
          <>
            {visibleKeys.map((key) => {
              const [year, month] = key.split("-");
              const dateObj = new Date(`${year}-${month}-01`);
              return (
                <div
                  key={key}
                  className="mb-8"
                >
                  <h2 className="text-xl font-bold mb-2">
                    {dateObj.getFullYear()} 年 {dateObj.getMonth() + 1} 月
                  </h2>
                  {visibleGrouped[key].map((order) => (
                    <Link
                      key={order.id}
                      href={`/attendee/orders/${order.id}`}
                      className="block w-full cursor-pointer hover:shadow mb-4"
                    >
                      <Card className="transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg mb-1">{order.title}</CardTitle>
                          <CardDescription className="text-sm mb-1">{order.date}</CardDescription>
                          <div className="text-xs text-gray-500 mb-2">訂單編號：{order.id}</div>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2 text-sm text-gray-700 pb-0">
                          <span className="flex items-center">📍{order.location}</span>
                          <span className="flex items-center">💳付款方式：{order.payType}</span>
                          <span
                            className={`border px-4 py-1 rounded-full text-sm ml-auto flex items-center ${order.status === "待付款" ? "border-yellow-400 text-yellow-600" : order.status === "已付款" ? "border-green-400 text-green-600" : order.status === "已逾期" ? "border-blue-300 text-blue-500" : "border-gray-400 text-gray-600"}`}
                          >
                            {order.status}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              );
            })}
            {allOrders.length > visibleCount && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setVisibleCount((c) => c + 10)}
                  type="button"
                  variant="outline"
                >
                  查看更多
                </Button>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
