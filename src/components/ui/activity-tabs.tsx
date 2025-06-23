import { cn } from "@/utils/transformer";
import { CheckCircle, FileText, Globe, Loader, XCircle } from "lucide-react";
import type React from "react";

export type ActivityTabsValue = "draft" | "published" | "ended" | "canceled";

export interface ActivityTabsProps {
  value: ActivityTabsValue;
  onValueChange: (value: ActivityTabsValue) => void;
  counts: {
    draft: number;
    published: number;
    ended: number;
    canceled: number;
  };
  loading?: boolean;
  className?: string;
}

const tabConfig = [
  {
    value: "draft" as ActivityTabsValue,
    label: "草稿",
    icon: FileText,
    activeClass: "border-b-2 border-blue-500 text-blue-600 bg-blue-50",
    hoverClass: "hover:text-blue-600 hover:bg-blue-50",
    countClass: "bg-blue-100 text-blue-800",
  },
  {
    value: "published" as ActivityTabsValue,
    label: "已發布",
    icon: Globe,
    activeClass: "border-b-2 border-green-500 text-green-600 bg-green-50",
    hoverClass: "hover:text-green-600 hover:bg-green-50",
    countClass: "bg-green-100 text-green-800",
  },
  {
    value: "ended" as ActivityTabsValue,
    label: "已結束",
    icon: CheckCircle,
    activeClass: "border-b-2 border-gray-500 text-gray-600 bg-gray-50",
    hoverClass: "hover:text-gray-600 hover:bg-gray-50",
    countClass: "bg-gray-100 text-gray-800",
  },
  {
    value: "canceled" as ActivityTabsValue,
    label: "已取消",
    icon: XCircle,
    activeClass: "border-b-2 border-red-500 text-red-600 bg-red-50",
    hoverClass: "hover:text-red-600 hover:bg-red-50",
    countClass: "bg-red-100 text-red-800",
  },
];

export const ActivityTabs: React.FC<ActivityTabsProps> = ({
  value,
  onValueChange,
  counts,
  loading,
  className,
}) => {
  return (
    <div className={cn("bg-white border-b border-gray-200", className)}>
      <div className="px-2 sm:px-4 md:px-6">
        <div className="flex space-x-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = value === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onValueChange(tab.value)}
                className={cn(
                  "flex items-center px-2 sm:px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-200 border-b-2 border-transparent whitespace-nowrap min-w-fit",
                  isActive ? tab.activeClass : `text-gray-500 ${tab.hoverClass}`
                )}
              >
                <Icon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 flex-shrink-0" />
                <span className="mr-1 md:mr-2 truncate">{tab.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center h-5 md:h-[26px] text-xs font-medium rounded-full min-w-[16px] sm:min-w-[18px] md:min-w-[22px] flex-shrink-0",
                    isActive ? tab.countClass : "bg-gray-100 hidden"
                  )}
                >
                  {loading ? (
                    <Loader className={cn("animate-spin h-3 w-3 text-gray-500", tab.countClass)} />
                  ) : (
                    counts[tab.value]
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityTabs;
