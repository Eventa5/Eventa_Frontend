"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, useState } from "react";

import { CalendarIcon, Search } from "lucide-react";
import type { DateRange } from "react-day-picker";

import type { OrderTabsValue } from "@/components/ui/order-tabs";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { OrderCard } from "@/components/ui/order-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import "@/styles/customs/calendar-range.css";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/features/orders/useOrders";
import type { OrderResponse } from "@/services/api/client/types.gen";

const OrderTabs = dynamic(() => import("@/components/ui/order-tabs"), { ssr: false });

export default function OrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState<OrderTabsValue>("all");
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // 狀態對應
  const statusMap: Record<OrderTabsValue, string[]> = {
    all: [],
    registered: ["已付款", "已使用"],
    pending: ["待付款"],
    cancelled: ["已取消"],
    expired: ["已逾期"],
  };

  // 準備 API 查詢參數
  const queryParams = {
    title: search || undefined,
    from: searchDate?.from?.toISOString().split("T")[0],
    to: searchDate?.to?.toISOString().split("T")[0],
    status: tab === "all" ? undefined : statusMap[tab].join(","),
  };

  const { data: ordersData, error, isLoading } = useOrders(queryParams);
  const orders = ordersData?.data || [];

  // 計算各狀態數量
  const counts = {
    all: orders.length,
    registered: orders.filter((o: OrderResponse) => o.status === "已付款" || o.status === "已使用")
      .length,
    pending: orders.filter((o: OrderResponse) => o.status === "待付款").length,
    cancelled: orders.filter((o: OrderResponse) => o.status === "已取消").length,
    expired: orders.filter((o: OrderResponse) => o.status === "已逾期").length,
  };

  const [visibleCount, setVisibleCount] = React.useState(3);
  const [filteredOrders, setFilteredOrders] = React.useState<OrderResponse[]>(orders);

  // 依年月分組
  function groupOrdersByYearAndMonth(orders: OrderResponse[]) {
    return orders.reduce(
      (acc, order) => {
        if (!order.activity?.startTime) return acc;
        const [year, month] = order.activity.startTime.split("-");
        if (!acc[year]) acc[year] = {};
        if (!acc[year][month]) acc[year][month] = [];
        acc[year][month].push(order);
        return acc;
      },
      {} as Record<string, Record<string, OrderResponse[]>>
    );
  }
  // 依 tab 狀態過濾訂單
  const tabFilteredOrders =
    tab === "all"
      ? filteredOrders
      : filteredOrders.filter((o) => o.status && statusMap[tab].includes(o.status));

  const monthMap = {
    "01": { zh: "一月", en: "January" },
    "02": { zh: "二月", en: "February" },
    "03": { zh: "三月", en: "March" },
    "04": { zh: "四月", en: "April" },
    "05": { zh: "五月", en: "May" },
    "06": { zh: "六月", en: "June" },
    "07": { zh: "七月", en: "July" },
    "08": { zh: "八月", en: "August" },
    "09": { zh: "九月", en: "September" },
    "10": { zh: "十月", en: "October" },
    "11": { zh: "十一月", en: "November" },
    "12": { zh: "十二月", en: "December" },
  };

  const grouped = groupOrdersByYearAndMonth(tabFilteredOrders);
  const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // 搜尋功能：依關鍵字與日期區間過濾
  const handleSearch = useCallback(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = orders.filter((order) => {
      if (!order.activity) return false;

      // 關鍵字比對（活動名稱、訂單編號、地點）
      const matchKeyword =
        !keyword ||
        order.activity.title?.toLowerCase().includes(keyword) ||
        order.id?.toLowerCase().includes(keyword) ||
        order.activity.location?.toLowerCase().includes(keyword);

      // 日期區間比對（只比對起始日）
      let matchDate = true;
      if (searchDate?.from && order.activity.startTime) {
        const orderDate = new Date(
          order.activity.startTime.split(" ")[0].replace(/-/g, "-")
        ).getTime();
        const fromTime = searchDate.from.getTime();
        const toTime = searchDate.to ? searchDate.to.getTime() : null;
        if (toTime) {
          matchDate = orderDate >= fromTime && orderDate <= toTime;
        } else {
          matchDate = orderDate >= fromTime;
        }
      }
      return matchKeyword && matchDate;
    });
    setFilteredOrders(filtered);
  }, [search, searchDate?.from, searchDate?.to, orders]);

  useEffect(() => {
    if (orders.length > 0) {
      handleSearch();
    }
  }, [handleSearch, orders]);

  return (
    <div className="container max-w-6xl mx-auto p-4 py-16 md:pb-[200px]">
      <h1 className="text-center md:text-left text-lg md:text-2xl font-bold mb-4">訂單管理</h1>
      <OrderTabs
        value={tab}
        onValueChange={setTab}
        counts={{
          all: counts.all || undefined,
          registered: counts.registered || undefined,
          pending: counts.pending || undefined,
          cancelled: counts.cancelled || undefined,
          expired: counts.expired || undefined,
        }}
        className="mb-4 border-b border-neutral-300"
      />
      <form
        className="flex flex-col md:flex-row gap-2 mb-6 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="w-full md:w-1/4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className="w-full flex justify-between items-center font-normal border-neutral-300 text-neutral-400 bg-white"
              >
                <span className={searchDate?.from ? "text-neutral-900" : "text-neutral-400"}>
                  {searchDate?.from ? (
                    searchDate.to ? (
                      <>
                        {searchDate.from.toLocaleDateString()} -{" "}
                        {searchDate.to.toLocaleDateString()}
                      </>
                    ) : (
                      searchDate.from.toLocaleDateString()
                    )
                  ) : (
                    "搜尋日期區間"
                  )}
                </span>
                <CalendarIcon className="ml-2 h-4 w-4 text-neutral-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-neutral-300"
              align="start"
            >
              <div className="flex items-center justify-between px-4 pt-2">
                {searchDate?.from && (
                  <button
                    type="button"
                    className="text-xs text-neutral-400 hover:text-neutral-600 underline"
                    onClick={() => setSearchDate({ from: undefined, to: undefined })}
                  >
                    清除
                  </button>
                )}
              </div>
              <Calendar
                mode="range"
                defaultMonth={searchDate?.from}
                selected={searchDate}
                onSelect={setSearchDate}
                numberOfMonths={2}
                classNames={{
                  selected: "bg-accent",
                  range_start:
                    "rounded-l-md bg-primary-500 hover:bg-primary-500 custom-range-start",
                  range_end: "rounded-r-md bg-primary-500 hover:bg-primary-500 custom-range-end",
                }}
                showOutsideDays={false}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative w-full md:w-1/3">
          <Input
            className="w-full border border-neutral-300 text-neutral-400 placeholder-neutral-400 pr-10"
            placeholder="輸入關鍵字搜尋..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            tabIndex={-1}
          >
            <Search className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={`skeleton-month-${Date.now()}-${i}`}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-4">
                {[...Array(2)].map((_, j) => (
                  <div
                    key={`skeleton-card-${Date.now()}-${i}-${j}`}
                    className="border border-neutral-200 rounded-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        (() => {
          if (orders.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <p className="text-lg text-neutral-400">目前尚無訂單</p>
                <Button
                  onClick={() => router.push("/events")}
                  className="px-6 py-2 rounded-lg md:text-lg h-auto"
                >
                  探索活動
                </Button>
              </div>
            );
          }
          if (tabFilteredOrders.length === 0) {
            return (
              <div className="text-center text-neutral-400 py-12 text-lg">無符合條件的訂單</div>
            );
          }
          return (
            <>
              {sortedYears.map((year) => {
                const openMonths = Object.keys(grouped[year]);
                return (
                  <div key={year}>
                    <div className="text-lg font-bold text-gray-400 mb-2">{year}</div>
                    <Accordion
                      type="multiple"
                      defaultValue={openMonths}
                    >
                      {openMonths
                        .sort((a, b) => b.localeCompare(a))
                        .map((month) => (
                          <AccordionItem
                            key={month}
                            value={month}
                            className="border-none mb-2 md:mb-6"
                          >
                            <AccordionTrigger className="flex items-center px-1 py-2 group hover:no-underline">
                              <span className="flex items-center gap-2">
                                <span className="text-2xl font-bold leading-none">
                                  {monthMap[month as keyof typeof monthMap].zh}
                                </span>
                                <span className="text-lg font-bold leading-none">
                                  {monthMap[month as keyof typeof monthMap].en}
                                </span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                              {grouped[year][month].map((order: OrderResponse) => (
                                <OrderCard
                                  key={order.id}
                                  order={order}
                                />
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </div>
                );
              })}
              {/* 查看更多按鈕 */}
              {tabFilteredOrders.length > visibleCount && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={() => {}}
                    type="button"
                    variant="outline"
                    className="border-neutral-600 text-neutral-600 hover:cursor-pointer px-15 py-3"
                  >
                    查看更多
                  </Button>
                </div>
              )}
            </>
          );
        })()
      )}
    </div>
  );
}
