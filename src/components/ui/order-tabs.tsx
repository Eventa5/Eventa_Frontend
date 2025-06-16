import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/utils/transformer";
import {
  CalendarX,
  ClipboardCheck,
  ClipboardList,
  ClipboardX,
  Loader2,
  TicketX,
  WalletCards,
  X,
} from "lucide-react";
import type React from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

export type OrderTabsValue = "all" | "paid" | "pending" | "canceled" | "expired";

export interface OrderTabsProps {
  value: OrderTabsValue;
  onValueChange: (value: OrderTabsValue) => void;
  counts: {
    all: number | undefined;
    paid: number | undefined;
    pending: number | undefined;
    canceled: number | undefined;
    expired: number | undefined;
    processing: number | undefined;
    failed: number | undefined;
    refunded: number | undefined;
  };
  className?: string;
}

const tabConfig = [
  {
    value: "all",
    label: "全部票卷",
    icon: WalletCards,
    iconClass: "text-secondary-500",
    labelClass: "group-hover:text-secondary-500 group-data-[state=active]:text-secondary-500",
    badge:
      "group-hover:bg-secondary-500 group-data-[state=active]:bg-secondary-500 group-hover:text-white group-data-[state=active]:text-white group-hover:border-secondary-500 group-data-[state=active]:border-secondary-500",
    badgeActive:
      "group-data-[state=active]:bg-secondary-500 group-data-[state=active]:text-white group-data-[state=active]:border-secondary-500",
    underline: "secondary-500",
  },
  {
    value: "paid",
    label: "已付款",
    icon: ClipboardCheck,
    iconClass: "text-green-500",
    labelClass: "group-hover:text-green-500 group-data-[state=active]:text-green-500",
    badge:
      "group-hover:bg-green-500 group-data-[state=active]:bg-green-500 group-hover:text-white group-data-[state=active]:text-white group-hover:border-green-500 group-data-[state=active]:border-green-500",
    badgeActive:
      "group-data-[state=active]:bg-green-500 group-data-[state=active]:text-white group-data-[state=active]:border-green-500",
    underline: "green-500",
  },
  {
    value: "pending",
    label: "待付款",
    icon: ClipboardList,
    iconClass: "text-primary-600",
    labelClass: "group-hover:text-primary-600 group-data-[state=active]:text-primary-600",
    badge:
      "group-hover:bg-primary-600 group-data-[state=active]:bg-primary-600 group-hover:text-white group-data-[state=active]:text-white group-hover:border-primary-600 group-data-[state=active]:border-primary-600",
    badgeActive:
      "group-data-[state=active]:bg-primary-600 group-data-[state=active]:text-white group-data-[state=active]:border-primary-600",
    underline: "primary-600",
  },
  {
    value: "canceled",
    label: "已取消",
    icon: ClipboardX,
    iconClass: "text-neutral-400",
    labelClass: "group-hover:text-neutral-400 group-data-[state=active]:text-neutral-400",
    badge:
      "group-hover:bg-neutral-400 group-data-[state=active]:bg-neutral-400 group-hover:text-white group-data-[state=active]:text-white group-hover:border-neutral-400 group-data-[state=active]:border-neutral-400",
    badgeActive:
      "group-data-[state=active]:bg-neutral-400 group-data-[state=active]:text-white group-data-[state=active]:border-neutral-400",
    underline: "neutral-400",
  },
  {
    value: "expired",
    label: "已逾期",
    icon: CalendarX,
    iconClass: "text-gray-400",
    labelClass: "group-hover:text-gray-400 group-data-[state=active]:text-gray-400",
    badge:
      "group-hover:bg-gray-400 group-data-[state=active]:bg-gray-400 group-hover:text-white group-data-[state=active]:text-white group-hover:border-gray-400 group-data-[state=active]:border-gray-400",
    badgeActive:
      "group-data-[state=active]:bg-gray-400 group-data-[state=active]:text-white group-data-[state=active]:border-gray-400",
    underline: "gray-400",
  },
  {
    value: "refunded",
    label: "已退款",
    icon: TicketX,
    iconClass: "text-gray-400",
    labelClass: "group-hover:text-gray-400 group-data-[state=active]:text-gray-400",
    badge:
      "group-hover:bg-gray-400 group-data-[state=active]:bg-gray-400 group-hover:text-white group-data-[state=active]:text-white group-hover:border-gray-400 group-data-[state=active]:border-gray-400",
    badgeActive:
      "group-data-[state=active]:bg-gray-400 group-data-[state=active]:text-white group-data-[state=active]:border-gray-400",
    underline: "gray-400",
  },
  {
    value: "processing",
    label: "付款中",
    icon: Loader2,
    iconClass: "text-primary-600",
    labelClass: "group-hover:text-primary-600 group-data-[state=active]:text-primary-600",
    badge:
      "group-hover:bg-primary-600 group-data-[state=active]:bg-primary-600 group-hover:text-white group-data-[state=active]:text-white group-hover:border-primary-600 group-data-[state=active]:border-primary-600",
    badgeActive:
      "group-data-[state=active]:bg-primary-600 group-data-[state=active]:text-white group-data-[state=active]:border-primary-600",
    underline: "primary-600",
  },
  {
    value: "failed",
    label: "付款失敗",
    icon: X,
    iconClass: "text-red-500",
    labelClass: "group-hover:text-red-500 group-data-[state=active]:text-red-500",
    badge:
      "group-hover:bg-red-500 group-data-[state=active]:bg-red-500 group-hover:text-white group-data-[state=active]:text-white group-hover:border-red-500 group-data-[state=active]:border-red-500",
    badgeActive:
      "group-data-[state=active]:bg-red-500 group-data-[state=active]:text-white group-data-[state=active]:border-red-500",
    underline: "red-500",
  },
];

export const OrderTabs: React.FC<OrderTabsProps> = ({
  value,
  onValueChange,
  counts,
  className,
}) => {
  const handleTabChange = (newValue: string) => {
    onValueChange(newValue as OrderTabsValue);
  };

  return (
    <Tabs
      value={value}
      onValueChange={handleTabChange}
      className={cn(className, "overflow-x-auto touch-scroll scrollbar-hide cursor-grab")}
    >
      <ScrollArea className="w-full overflow-x-auto">
        <TabsList className="bg-transparent p-0 h-auto">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "group relative flex items-center px-4 py-3 bg-transparent border-0 text-base font-medium transition-none focus-visible:outline-none focus-visible:shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold hover:font-bold rounded-none min-w-[152px] justify-center",
                  {
                    "data-[state=active]:border-b-2 data-[state=active]:border-secondary-500":
                      tab.underline === "secondary-500",
                    "data-[state=active]:border-b-2 data-[state=active]:border-green-500":
                      tab.underline === "green-500",
                    "data-[state=active]:border-b-2 data-[state=active]:border-primary-600":
                      tab.underline === "primary-600",
                    "data-[state=active]:border-b-2 data-[state=active]:border-neutral-400":
                      tab.underline === "neutral-400",
                    "data-[state=active]:border-b-2 data-[state=active]:border-gray-400":
                      tab.underline === "gray-400",
                    "data-[state=active]:border-b-2 data-[state=active]:border-red-500":
                      tab.underline === "red-500",
                  }
                )}
              >
                <Icon className={cn("size-6", tab.iconClass)} />

                <span className={cn("ml-1 text-neutral-400 text-sm md:text-lg", tab.labelClass)}>
                  {tab.label}
                </span>
                {counts[tab.value as OrderTabsValue] !== undefined && (
                  <span
                    className={cn(
                      "ml-1 inline-flex items-center justify-center rounded-full px-2 text-xs font-normal min-w-[20px] border border-neutral-400 text-neutral-400 bg-transparent transition-colors",
                      tab.badge,
                      tab.badgeActive
                    )}
                  >
                    {counts[tab.value as OrderTabsValue]}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
};

export default OrderTabs;
