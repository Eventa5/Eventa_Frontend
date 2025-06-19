"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, useState, useRef, useMemo } from "react";

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

  // 新增一個狀態來追蹤總數查詢參數
  const [totalQueryParams, setTotalQueryParams] = useState({
    page: 1,
    limit: 8,
    title: undefined as string | undefined,
    from: undefined as string | undefined,
    to: undefined as string | undefined,
    status: undefined as string | undefined,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const isLoadingMoreRef = useRef(false);
  const isMounted = useRef(false);

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

  const { data: ordersData, error, isLoading, mutate } = useOrders(queryParams);
  const { data: totalOrdersData } = useOrders(totalQueryParams);
  const [allOrders, setAllOrders] = useState<OrderResponse[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // 當 ordersData 更新時，追加新資料到 allOrders
  useEffect(() => {
    if (ordersData?.data) {
      if (queryParams.page === 1) {
        setAllOrders(ordersData.data);
        // 重置展開狀態
        setExpandedMonths([]);
      } else {
        setAllOrders((prev) => [...prev, ...ordersData.data]);
      }
    }
  }, [ordersData?.data, queryParams.page]);

  // 當 allOrders 更新時，更新計數
  useEffect(() => {
    if (allOrders.length > 0) {
      // 計算各狀態的數量
      const newCounts = {
        all: totalOrdersData?.pagination?.totalItems || 0,
        paid: allOrders.filter((o: OrderResponse) => o.status === "paid").length,
        pending: allOrders.filter((o: OrderResponse) => o.status === "pending").length,
        canceled: allOrders.filter((o: OrderResponse) => o.status === "canceled").length,
        expired: allOrders.filter((o: OrderResponse) => o.status === "expired").length,
        processing: allOrders.filter((o: OrderResponse) => o.status === "processing").length,
        failed: allOrders.filter((o: OrderResponse) => o.status === "failed").length,
        refunded: allOrders.filter((o: OrderResponse) => o.status === "refunded").length,
      };
      setCounts(newCounts);
    }
  }, [allOrders, totalOrdersData?.pagination?.totalItems]);

  // 使用 useMemo 來計算過濾後的訂單和分組
  const { filteredOrders, grouped, sortedYears } = useMemo(() => {
    const filtered =
      tab === "all" ? allOrders : allOrders.filter((o: OrderResponse) => o.status === tab);

    const grouped = groupOrdersByYearAndMonth(filtered);
    const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return { filteredOrders: filtered, grouped, sortedYears };
  }, [allOrders, tab]);

  // 當 allOrders 更新時，更新展開狀態
  useEffect(() => {
    if (allOrders.length > 0) {
      const newExpandedMonths = Object.entries(grouped).flatMap(([year, months]) =>
        Object.keys(months).map((month) => `${year}-${month}`)
      );

      setExpandedMonths((prev) => {
        // 如果是第一頁，則使用新的展開狀態
        if (queryParams.page === 1) {
          return newExpandedMonths;
        }
        // 如果是載入更多，則合併現有和新增加的月份
        const uniqueMonths = new Set([...prev, ...newExpandedMonths]);
        return Array.from(uniqueMonths);
      });
    }
  }, [allOrders, queryParams.page, grouped]);

  // 處理 Accordion 的展開狀態變更
  const handleAccordionChange = useCallback((value: string[]) => {
    setExpandedMonths(value);
  }, []);

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
    setTotalQueryParams((prev) => ({
      ...prev,
      title: searchValue || undefined,
      from: newParams.from,
      to: newParams.to,
    }));
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

  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // 處理載入更多
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMoreRef.current) return;

    isLoadingMoreRef.current = true;
    try {
      const nextPage = queryParams.page + 1;
      const newParams = {
        ...queryParams,
        page: nextPage,
      };

      await mutate(newParams as any);
      setQueryParams((prev) => ({
        ...prev,
        page: nextPage,
      }));
    } catch (error) {
      console.error("載入更多訂單時發生錯誤:", error);
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [queryParams, mutate]);

  // 只在組件首次掛載時載入第一頁
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
      }));
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

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
    const newParams = {
      page: 1,
      limit: 8,
      title: undefined,
      from: undefined,
      to: undefined,
      status: tab === "all" ? undefined : tab,
    };
    setQueryParams(newParams);
    setTotalQueryParams((prev) => ({
      ...prev,
      title: undefined,
      from: undefined,
      to: undefined,
    }));
  }, [tab]);

  return (
    <div className="container max-w-6xl mx-auto p-4 py-16 md:pb-[200px]">
      <h1 className="text-center md:text-left text-lg md:text-2xl font-bold mb-4">訂單管理</h1>
      <OrderTabs
        value={tab}
        onValueChange={handleTabChange}
        counts={{
          all: totalOrdersData?.pagination?.totalItems || undefined,
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
                  months: "flex flex-col md:flex-row",
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
                    key={`skeleton-order-${Date.now()}-${i}-${j}`}
                    className="h-12 bg-neutral-200 rounded-md"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : allOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-lg text-neutral-600">目前無符合訂單</p>
          {tab === "all" && (
            <Button
              onClick={() => router.push("/event")}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              前往報名活動
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedYears.map((year) => {
            const openMonths = Object.keys(grouped[year]);
            return (
              <div key={year}>
                <div className="text-lg font-bold text-gray-400 mb-2">{year}</div>
                <Accordion
                  type="multiple"
                  value={expandedMonths.filter((month) => month.startsWith(year))}
                  onValueChange={handleAccordionChange}
                >
                  {openMonths
                    .sort((a, b) => b.localeCompare(a))
                    .map((month) => (
                      <AccordionItem
                        key={month}
                        value={`${year}-${month}`}
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
                          {grouped[year][month].map((order: OrderResponse, index: number) => (
                            <OrderCard
                              key={`${order.id}-${order.activity?.startTime || ""}-${order.status}-${index}`}
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
          {ordersData?.pagination?.hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleLoadMore}
                type="button"
                variant="outline"
                className="border-neutral-600 text-neutral-600 hover:cursor-pointer px-15 py-3"
                disabled={isLoadingMoreRef.current}
              >
                {isLoadingMoreRef.current ? "載入中..." : "查看更多"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
