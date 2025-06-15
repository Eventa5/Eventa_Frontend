"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, useState, useRef } from "react";

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
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 8,
    title: undefined as string | undefined,
    from: undefined as string | undefined,
    to: undefined as string | undefined,
    status: undefined as string | undefined,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 使用 useState 來管理計數
  const [counts, setCounts] = useState({
    all: 0,
    paid: 0,
    pending: 0,
    canceled: 0,
    expired: 0,
    processing: 0,
    failed: 0,
    refunded: 0,
  });

  // 取得所有訂單用於計算數量
  const allOrdersParams = { limit: 100 };
  const [allOrders, setAllOrders] = useState<OrderResponse[]>([]);
  const { data: allOrdersData } = useOrders(allOrdersParams);

  useEffect(() => {
    if (allOrdersData?.data) {
      setAllOrders(allOrdersData.data);
    }
  }, [allOrdersData?.data]);

  // 當所有訂單資料載入時，計算各狀態數量
  useEffect(() => {
    if (allOrders.length > 0) {
      setCounts({
        all: allOrders.length,
        paid: allOrders.filter((o: OrderResponse) => o.status === "paid").length,
        pending: allOrders.filter((o: OrderResponse) => o.status === "pending").length,
        canceled: allOrders.filter((o: OrderResponse) => o.status === "canceled").length,
        expired: allOrders.filter((o: OrderResponse) => o.status === "expired").length,
        processing: allOrders.filter((o: OrderResponse) => o.status === "processing").length,
        failed: allOrders.filter((o: OrderResponse) => o.status === "failed").length,
        refunded: allOrders.filter((o: OrderResponse) => o.status === "refunded").length,
      });
    }
  }, [allOrders]);

  const { data: ordersData, error, isLoading, mutate } = useOrders(queryParams);
  const orders = ordersData?.data || [];

  // 格式化日期為指定格式並使用台灣時區
  const formatDate = useCallback((date: Date) => {
    // 轉換為台灣時區的日期
    const taiwanDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
    // 調整為台灣時區的 ISO 字串
    const year = taiwanDate.getFullYear();
    const month = String(taiwanDate.getMonth() + 1).padStart(2, "0");
    const day = String(taiwanDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // 處理日期選擇
  const handleDateSelect = (date: DateRange | undefined) => {
    setSearchDate(date);
    // 當日期變更時觸發搜尋
    const fromDate = date?.from ? formatDate(date.from) : undefined;
    const toDate = date?.to ? formatDate(date.to) : undefined;

    // 如果兩個日期都選擇完成且不是同一天，或是兩個日期都清除，則觸發搜尋
    if (
      (date?.from && date?.to && fromDate !== toDate) ||
      (date?.from === undefined && date?.to === undefined)
    ) {
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        from: date?.from === undefined ? undefined : fromDate,
        to: date?.to === undefined ? undefined : toDate,
      }));
    }
  };

  // 處理清除按鈕點擊
  const handleClearDate = () => {
    setSearchDate({ from: undefined, to: undefined });
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      from: undefined,
      to: undefined,
    }));
  };

  // 處理搜尋按鈕點擊
  const handleSearch = useCallback(() => {
    const searchValue = searchInputRef.current?.value || "";
    const newParams = {
      page: 1,
      limit: 8,
      title: searchValue || undefined,
      from: undefined as string | undefined,
      to: undefined as string | undefined,
      status: tab === "all" ? undefined : tab,
    };

    // 如果有選擇日期，則加入日期參數
    if (searchDate?.from && searchDate?.to) {
      newParams.from = formatDate(searchDate.from);
      newParams.to = formatDate(searchDate.to);
    }

    setQueryParams(newParams);
  }, [searchDate, tab, formatDate]);

  // 處理 tab 變更
  const handleTabChange = useCallback((newTab: OrderTabsValue) => {
    setTab(newTab);
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      status: newTab === "all" ? undefined : newTab,
    }));
  }, []);

  const [visibleCount, setVisibleCount] = React.useState(8);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // 處理載入更多
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = Math.ceil(visibleCount / queryParams.limit) + 1;
      const newParams = {
        ...queryParams,
        page: nextPage,
      };

      await mutate(newParams as any);
      setVisibleCount((prev) => prev + 8); // 假設每頁固定載入 8 筆資料
    } catch (error) {
      console.error("載入更多訂單時發生錯誤:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, queryParams, mutate, visibleCount]);

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
  // // 依 tab 狀態過濾訂單
  // const tabFilteredOrders =
  //   tab === "all"
  //     ? filteredOrders
  //     : filteredOrders.filter((o) => o.status && statusMap[tab].includes(o.status));

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

  const grouped = groupOrdersByYearAndMonth(orders);
  const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // 處理分頁變更
  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page,
    }));
  };

  // 重置搜尋條件
  const handleReset = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setSearchDate({ from: undefined, to: undefined });
    setQueryParams({
      page: 1,
      limit: 8,
      title: undefined,
      from: undefined,
      to: undefined,
      status: tab === "all" ? undefined : tab,
    });
  }, [tab]);

  return (
    <div className="container max-w-6xl mx-auto p-4 py-16 md:pb-[200px]">
      <h1 className="text-center md:text-left text-lg md:text-2xl font-bold mb-4">訂單管理</h1>
      <OrderTabs
        value={tab}
        onValueChange={handleTabChange}
        counts={{
          all: counts.all || undefined,
          paid: counts.paid || undefined,
          pending: counts.pending || undefined,
          canceled: counts.canceled || undefined,
          expired: counts.expired || undefined,
          refunded: counts.refunded || undefined,
          processing: counts.processing || undefined,
          failed: counts.failed || undefined,
        }}
        className="mb-4 border-b border-neutral-300"
      />
      <form
        className="flex flex-col md:flex-row gap-2 mb-6 md:items-center"
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
                className="w-full flex justify-between items-center font-normal border-neutral-300 text-neutral-400 bg-white md:text-base"
              >
                <span className={searchDate?.from ? "text-neutral-900" : "text-neutral-400"}>
                  {searchDate?.from ? (
                    searchDate.to ? (
                      <>
                        {searchDate.from.toLocaleDateString()} -{searchDate.to.toLocaleDateString()}
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
                    onClick={handleClearDate}
                  >
                    清除
                  </button>
                )}
              </div>
              <Calendar
                mode="range"
                defaultMonth={searchDate?.from}
                selected={searchDate}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                classNames={{
                  selected: "bg-accent",
                  range_start:
                    "rounded-l-md bg-primary-500 hover:bg-primary-500 custom-range-start",
                  range_end: "rounded-r-md bg-primary-500 hover:bg-primary-500 custom-range-end",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative w-full md:w-1/3">
          <Input
            ref={searchInputRef}
            className="w-full border border-neutral-300 text-neutral-400 placeholder-neutral-400 pr-10 text-sm md:text-base"
            placeholder="輸入關鍵字搜尋..."
            defaultValue={search}
            type="search"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <Search className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-neutral-300 text-neutral-400 hover:text-neutral-600 text-sm md:text-base"
          onClick={handleReset}
        >
          清除條件
        </Button>
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
          if (orders.length === 0) {
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
                            <AccordionTrigger className="flex items-center px-1 py-2 pb-4 group hover:no-underline">
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
              {orders.length > visibleCount && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleLoadMore}
                    type="button"
                    variant="outline"
                    className="border-neutral-600 text-neutral-600 hover:cursor-pointer px-15 py-3"
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "載入中..." : "查看更多"}
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
