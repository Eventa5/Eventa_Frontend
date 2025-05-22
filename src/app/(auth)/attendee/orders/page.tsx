"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useCallback } from "react";

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

import "@/styles/calendar-range.css";

const OrderTabs = dynamic(() => import("@/components/ui/order-tabs"), { ssr: false });

type Order = {
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

export default function OrdersPage() {
  const orders: Order[] = [
    {
      id: "2307281011564244710900",
      status: "已付款",
      paidAt: "2025-04-18 23:05:00",
      paidExpiredAt: "2025-04-18 23:10:00",
      paymentMethod: "信用卡",
      activity: {
        title: "藝術市集：創意手作與在地文創展覽",
        location: "台南市",
        startTime: "2025-09-10 13:00:00",
        endTime: "2025-09-10 15:00:00",
      },
    },
    {
      id: "2202121720571882545141",
      status: "待付款",
      paidAt: null,
      paidExpiredAt: "2025-04-18 23:10:00",
      paymentMethod: null,
      activity: {
        title: "復古黑膠﻿派對之夜",
        location: "台北市",
        startTime: "2025-05-10 20:00:00",
        endTime: "2025-05-10 23:30:00",
      },
    },
    {
      id: "2401011234567890123456",
      status: "已取消",
      paidAt: null,
      paidExpiredAt: "2025-06-01 12:00:00",
      paymentMethod: null,
      activity: {
        title: "夏日音樂節：青春搖滾之夜",
        location: "高雄市",
        startTime: "2025-07-15 18:00:00",
        endTime: "2025-07-15 22:00:00",
      },
    },
    {
      id: "2402022345678901234567",
      status: "已逾期",
      paidAt: null,
      paidExpiredAt: "2025-05-01 23:59:59",
      paymentMethod: null,
      activity: {
        title: "未來藝術家｜跨界表演藝術節",
        location: "新北市",
        startTime: "2025-08-20 10:00:00",
        endTime: "2025-08-20 17:00:00",
      },
    },
    {
      id: "2501011234567890123456",
      status: "已使用",
      paidAt: "2025-05-01 12:00:00",
      paidExpiredAt: "2025-05-01 12:10:00",
      paymentMethod: "LINE Pay",
      activity: {
        title: "玩樂本就是人之天性，這樣辦活動真好玩！",
        location: "高雄市",
        startTime: "2024-12-01 14:00:00",
        endTime: "2024-12-01 17:00:00",
      },
    },
  ];

  // 狀態對應
  const statusMap: Record<OrderTabsValue, string[]> = {
    all: [],
    registered: ["已付款", "已使用"],
    pending: ["待付款"],
    cancelled: ["已取消"],
    expired: ["已逾期"],
  };

  // 計算各狀態數量
  const counts = {
    all: orders.length,
    registered: orders.filter((o) => o.status === "已付款" || o.status === "已使用").length,
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
    from: undefined,
    to: undefined,
  });
  const [visibleCount, setVisibleCount] = React.useState(10);
  const [filteredOrders, setFilteredOrders] = React.useState<Order[]>(orders);

  // 依年月分組
  function groupOrdersByYearAndMonth(orders: Order[]) {
    return orders.reduce(
      (acc, order) => {
        const [year, month] = order.activity.startTime.split("-");
        if (!acc[year]) acc[year] = {};
        if (!acc[year][month]) acc[year][month] = [];
        acc[year][month].push(order);
        return acc;
      },
      {} as Record<string, Record<string, Order[]>>
    );
  }
  // 依 tab 狀態過濾訂單
  const tabFilteredOrders =
    tab === "all"
      ? filteredOrders
      : filteredOrders.filter((o) => statusMap[tab].includes(o.status));

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
    setFilteredOrders(
      orders.filter((order) => {
        // 關鍵字比對（活動名稱、訂單編號、地點）
        const matchKeyword =
          !keyword ||
          order.activity.title.toLowerCase().includes(keyword) ||
          order.id.toLowerCase().includes(keyword) ||
          order.activity.location.toLowerCase().includes(keyword);
        // 日期區間比對（只比對起始日）
        let matchDate = true;
        if (searchDate?.from) {
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
      })
    );
  }, [search, searchDate?.from, searchDate?.to]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="container mx-auto p-4 pb-16 md:pb-[200px]">
      <h1 className="text-center md:text-left text-lg md:text-2xl font-bold mb-4">訂單管理</h1>
      <OrderTabs
        value={tab}
        onValueChange={setTab}
        counts={counts}
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
              className="w-auto p-0"
              align="start"
            >
              <div className="flex items-center justify-between px-4 pt-2">
                <span className="text-sm font-medium">選擇日期區間</span>
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
                  // today: "bg-transparent",
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

      {/* 依年月分組顯示訂單 */}
      {(() => {
        if (tabFilteredOrders.length === 0) {
          return (
            <div className="text-center text-neutral-400 py-12 text-lg">查無符合條件的訂單</div>
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
                    className="mb-8"
                  >
                    {openMonths
                      .sort((a, b) => b.localeCompare(a))
                      .map((month) => (
                        <AccordionItem
                          key={month}
                          value={month}
                          className="border-none"
                        >
                          <AccordionTrigger className="flex items-center mb-2 px-1 py-2 group hover:no-underline">
                            <span className="flex items-center gap-2">
                              <span className="text-2xl font-bold leading-none">
                                {monthMap[month as keyof typeof monthMap].zh}
                              </span>
                              <span className="text-lg font-bold leading-none">
                                {monthMap[month as keyof typeof monthMap].en}
                              </span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            {grouped[year][month].map((order) => (
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
