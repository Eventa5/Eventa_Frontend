import { cn } from "@/utils/transformer";
import { CalendarX, ClipboardCheck, ClipboardList, ClipboardX, WalletCards } from "lucide-react";
import type React from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

export type OrderTabsValue = "all" | "registered" | "pending" | "cancelled" | "expired";

export interface OrderTabsProps {
  value: OrderTabsValue;
  onValueChange: (value: OrderTabsValue) => void;
  counts: {
    all: number;
    registered: number;
    pending: number;
    cancelled: number;
    expired: number;
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
    value: "registered",
    label: "已報名",
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
    label: "未完成",
    icon: ClipboardList,
    iconClass: "text-yellow-400",
    labelClass: "group-hover:text-yellow-400 group-data-[state=active]:text-yellow-400",
    badge:
      "group-hover:bg-yellow-400 group-data-[state=active]:bg-yellow-400 group-hover:text-white group-data-[state=active]:text-white group-hover:border-yellow-400 group-data-[state=active]:border-yellow-400",
    badgeActive:
      "group-data-[state=active]:bg-yellow-400 group-data-[state=active]:text-white group-data-[state=active]:border-yellow-400",
    underline: "yellow-400",
  },
  {
    value: "cancelled",
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
];

export const OrderTabs: React.FC<OrderTabsProps> = ({
  value,
  onValueChange,
  counts,
  className,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as OrderTabsValue)}
      className={className}
    >
      <TabsList className="bg-transparent p-0 gap-6 h-auto">
        {tabConfig.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                `group relative flex items-center gap-1.5 px-4 py-3 bg-transparent border-0 text-base font-medium transition-none focus-visible:outline-none focus-visible:shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-${tab.underline} hover:font-bold rounded-none`
              )}
            >
              <Icon className={cn("size-6", tab.iconClass)} />

              <span className={cn("ml-1 text-neutral-400", tab.labelClass)}>{tab.label}</span>
              <span
                className={cn(
                  "ml-1 inline-flex items-center justify-center rounded-full px-1.5 text-xs font-normal min-w-[20px] border border-neutral-400 text-neutral-400 bg-transparent transition-colors",
                  tab.badge,
                  tab.badgeActive
                )}
              >
                {counts[tab.value as OrderTabsValue]}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default OrderTabs;
