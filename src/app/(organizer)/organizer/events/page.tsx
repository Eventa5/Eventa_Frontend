"use client";

import { ActivityTabs } from "@/components/ui/activity-tabs";
import type { ActivityTabsValue } from "@/components/ui/activity-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getApiV1Activities,
  patchApiV1ActivitiesByActivityIdCancel,
  patchApiV1ActivitiesByActivityIdPublish,
} from "@/services/api/client/sdk.gen";
import type { ActivitiesResponse, PaginationResponse } from "@/services/api/client/types.gen";
import { useErrorHandler } from "@/utils/error-handler";
import {
  Airplay,
  Ban,
  Calendar as CalendarIcon,
  Eye,
  MapPin,
  MoreHorizontal,
  Play,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// 活動狀態枚舉
enum ActivityStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ENDED = "ended",
  CANCELED = "canceled",
}

// 活動狀態統計介面
interface EventStatusCounts {
  draft: number;
  published: number;
  ended: number;
  canceled: number;
}

// API 查詢參數介面
interface QueryParams {
  page: number;
  limit: number;
  keyword?: string;
  status?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
}

// 狀態徽章組件
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    const statusConfig = {
      [ActivityStatus.DRAFT]: {
        label: "草稿",
        className: "bg-blue-100 text-blue-800",
      },
      [ActivityStatus.PUBLISHED]: {
        label: "已發布",
        className: "bg-green-100 text-green-800",
      },
      [ActivityStatus.ENDED]: {
        label: "已結束",
        className: "bg-gray-100 text-gray-800",
      },
      [ActivityStatus.CANCELED]: {
        label: "已取消",
        className: "bg-red-100 text-red-800",
      },
    };
    return (
      statusConfig[status as ActivityStatus] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 md:px-6 md:py-2 rounded-md text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

// 動作下拉選單組件
const ActionDropdown = ({
  event,
  onStatusChange,
}: {
  event: ActivitiesResponse;
  onStatusChange: (eventId: number, action: "publish" | "cancel") => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleViewEvent = () => {
    if (event.id) {
      window.location.href = `/organizer/events/${event.id}`;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {isOpen && (
        <>
          <div className="absolute right-0 top-8 z-20 w-40 md:w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <button
              type="button"
              className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm hover:bg-gray-50 flex items-center"
              onClick={() => handleViewEvent()}
            >
              <Eye className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              查看
            </button>
            {event.status === ActivityStatus.DRAFT && (
              <button
                type="button"
                className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm hover:bg-gray-50 flex items-center"
                onClick={() => {
                  if (event.id) {
                    onStatusChange(event.id, "publish");
                    setIsOpen(false);
                  }
                }}
              >
                <Play className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                發布
              </button>
            )}
            {event.status === ActivityStatus.PUBLISHED && (
              <button
                type="button"
                className="w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm hover:bg-gray-50 flex items-center"
                onClick={() => {
                  if (event.id) {
                    onStatusChange(event.id, "cancel");
                    setIsOpen(false);
                  }
                }}
              >
                <Ban className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                取消
              </button>
            )}
          </div>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed left-0 top-0 w-full h-screen opacity-0 z-10"
          />
        </>
      )}
    </div>
  );
};

// 活動卡片組件
const EventCard = ({
  event,
  onStatusChange,
}: {
  event: ActivitiesResponse;
  onStatusChange: (eventId: number, action: "publish" | "cancel") => void;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow border border-gray-200">
      <CardContent className="p-5">
        {/* 電腦版：水平排列 */}
        <div className="hidden md:flex items-center gap-x-3">
          {/* 封面圖片 */}
          <div className="w-40 h-34 flex-shrink-0 bg-gray-50 overflow-hidden rounded-lg border border-gray-100">
            {event.cover ? (
              <>
                <img
                  src={event.cover}
                  alt={event.title || "活動封面"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div
                  className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  <div className="text-center">
                    <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                    <span className="text-xs text-gray-400">活動封面</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">活動封面</span>
                </div>
              </div>
            )}
          </div>

          {/* 活動資訊 */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 mr-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[3.5rem]">
                  {event.title}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    {event.isOnline ? (
                      <div className="flex items-center">
                        <Airplay className="h-4 w-4 mr-2 text-gray-400" />
                        線上活動
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        線下活動 <span>·</span> {event.location || "地點待定"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <StatusBadge status={event.status || ""} />
                <ActionDropdown
                  event={event}
                  onStatusChange={onStatusChange}
                />
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>
                  {event.startTime
                    ? new Date(event.startTime).toLocaleString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "開始時間待定"}
                  {event.endTime && event.startTime && (
                    <span>
                      {" - "}
                      {new Date(event.endTime).toLocaleString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 手機版：垂直排列 */}
        <div className="lg:hidden">
          {/* 封面圖片 */}
          <div className="w-full h-40 bg-gray-50 overflow-hidden rounded-lg border border-gray-100 mb-4">
            {event.cover ? (
              <>
                <img
                  src={event.cover}
                  alt={event.title || "活動封面"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  <div className="text-center">
                    <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                    <span className="text-xs text-gray-400">活動封面</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">活動封面</span>
                </div>
              </div>
            )}
          </div>

          {/* 活動資訊 */}
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 mr-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[3.5rem]">
                  {event.title}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    {event.isOnline ? (
                      <div className="flex items-center">
                        <Airplay className="h-4 w-4 mr-2 text-gray-400" />
                        線上活動
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        線下活動 <span>·</span> {event.location || "地點待定"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <StatusBadge status={event.status || ""} />
                <ActionDropdown
                  event={event}
                  onStatusChange={onStatusChange}
                />
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <div className="space-y-1">
                  <div>
                    {event.startTime
                      ? new Date(event.startTime).toLocaleString("zh-TW", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "開始時間待定"}
                  </div>
                  {event.endTime && event.startTime && (
                    <div>
                      {new Date(event.endTime).toLocaleString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function EventsPage() {
  const { handleError } = useErrorHandler();
  const [events, setEvents] = useState<ActivitiesResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>({});
  const [loading, setLoading] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startTime?: string;
    endTime?: string;
  }>({});

  // 實際查詢參數（用於API調用）
  const [activeFilters, setActiveFilters] = useState({
    keyword: "",
    status: "published" as ActivityTabsValue,
    location: "",
    dateRange: {} as { startTime?: string; endTime?: string },
  });

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);

  // 獲取活動列表
  const fetchEvents = useCallback(async () => {
    setLoading(true);

    try {
      const queryParams: QueryParams = {
        page: currentPage,
        limit: 10,
        ...(activeFilters.keyword && { keyword: activeFilters.keyword }),
        ...(activeFilters.status && { status: activeFilters.status }),
        ...(activeFilters.location && { location: activeFilters.location }),
        ...(activeFilters.dateRange.startTime && {
          startTime: activeFilters.dateRange.startTime,
        }),
        ...(activeFilters.dateRange.endTime && {
          endTime: activeFilters.dateRange.endTime,
        }),
      };

      const response = await getApiV1Activities({
        query: queryParams,
      });

      if (response.error) {
        throw new Error(response.error.message || "獲取活動列表失敗");
      }

      if (response.data?.data) {
        setEvents(response.data.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    activeFilters.keyword,
    activeFilters.status,
    activeFilters.location,
    activeFilters.dateRange.startTime,
    activeFilters.dateRange.endTime,
    handleError,
  ]);

  // 監聽參數變化並重新獲取數據
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 處理搜尋輸入變化
  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
  };

  // 處理狀態篩選變化
  const handleStatusFilterChange = (value: ActivityTabsValue) => {
    // 狀態變更時立即查詢
    setActiveFilters((prev) => ({ ...prev, status: value }));
    setCurrentPage(1);
  };

  // 處理地點輸入變化
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  // 處理查詢按鈕點擊
  const handleSearch = () => {
    setActiveFilters((prev) => ({
      ...prev,
      keyword: searchKeyword,
      location: selectedLocation,
      dateRange: dateRange,
    }));
    setCurrentPage(1);
  };

  // 計算活動狀態統計
  const eventCounts = useMemo(() => {
    const counts: EventStatusCounts = {
      draft: 0,
      published: 0,
      ended: 0,
      canceled: 0,
    };

    for (const event of events) {
      const status = event.status as ActivityStatus;
      if (status === ActivityStatus.DRAFT) counts.draft++;
      else if (status === ActivityStatus.PUBLISHED) counts.published++;
      else if (status === ActivityStatus.ENDED) counts.ended++;
      else if (status === ActivityStatus.CANCELED) counts.canceled++;
    }

    return counts;
  }, [events]);

  // 清除篩選
  const handleClearFilters = () => {
    setSearchKeyword("");
    setSelectedLocation("");
    setDateRange({});
    // 清除實際查詢參數
    setActiveFilters({
      keyword: "",
      status: "published",
      location: "",
      dateRange: {},
    });
    setCurrentPage(1);
  };

  // 處理狀態變更
  const handleStatusChange = async (eventId: number, action: "publish" | "cancel") => {
    try {
      if (action === "publish") {
        const response = await patchApiV1ActivitiesByActivityIdPublish({
          path: { activityId: Number(eventId) },
        });

        if (response.error) {
          throw new Error(response.error.message || "發布活動失敗");
        }
      } else {
        const response = await patchApiV1ActivitiesByActivityIdCancel({
          path: { activityId: Number(eventId) },
        });

        if (response.error) {
          throw new Error(response.error.message || "取消活動失敗");
        }
      }
      fetchEvents(); // 重新載入列表
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* 頁面標題 */}
      <div className="bg-white">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">活動管理</h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">管理您的所有活動</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* 篩選工具欄 */}
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="p-3 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
              <div className="relative sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜尋活動..."
                  value={searchKeyword}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <Input
                placeholder="地點篩選..."
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="sm:col-span-1 lg:col-span-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                onClick={handleSearch}
                className="sm:col-span-1 text-sm bg-primary-500 hover:saturate-150 duration-200 active:scale-95 cursor-pointer  rounded-md"
              >
                查詢
              </Button>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="sm:col-span-2 lg:col-span-1 text-sm"
              >
                清除篩選
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 狀態頁籤 */}
        <ActivityTabs
          value={activeFilters.status}
          onValueChange={handleStatusFilterChange}
          counts={eventCounts}
        />

        {/* 活動列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">載入中...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <div className="text-gray-500">沒有找到活動</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* 分頁控制 */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 py-4 md:py-6">
          <Button
            variant="outline"
            disabled={!pagination.hasPrevPage}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="w-full sm:w-auto text-sm"
          >
            上一頁
          </Button>
          <span className="text-xs md:text-sm text-gray-600 order-first sm:order-none">
            第 {pagination.currentPage} 頁，共 {pagination.totalPages} 頁
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="w-full sm:w-auto text-sm"
          >
            下一頁
          </Button>
        </div>
      </div>
    </div>
  );
}
