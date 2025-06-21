"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressStatusCard } from "@/features/organizer/components/progress-status-card";
import { StatCard } from "@/features/organizer/components/stat-card";
import {
  getApiV1ActivitiesByActivityId,
  getApiV1ActivitiesByActivityIdCheckedIn,
  getApiV1ActivitiesByActivityIdIncome,
  postApiV1ActivitiesByActivityIdCover,
} from "@/services/api/client/sdk.gen";
import type {
  ActivityResponse,
  GetCheckedInResponse,
  GetIncomeResponse,
} from "@/services/api/client/types.gen";
import { useErrorHandler } from "@/utils/error-handler";
import { BarChart3, Calendar, Edit3, Eye, TrendingUp, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ActivityStatus } from "../page";

interface EventStats {
  views: number;
  likes: number;
  status: string;
  ticketsSold: number;
  totalTickets: number;
  checkInCount: number;
  totalAttendees: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const { handleError } = useErrorHandler();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const checkinIntervalRef = useRef<NodeJS.Timeout | null>(null); // 新增：用於儲存定時器引用

  // 狀態管理
  const [activityData, setActivityData] = useState<ActivityResponse | null>(null);
  const [incomeData, setIncomeData] = useState<GetIncomeResponse | null>(null);
  const [checkedInData, setCheckedInData] = useState<GetCheckedInResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [statisticsPeriod, setStatisticsPeriod] = useState<"d" | "w">("w"); // 預設為周
  // 基於 API 數據計算的統計
  const stats: EventStats = {
    views: activityData?.viewCount || 0,
    likes: activityData?.likeCount || 0,
    status: activityData?.status || "草稿",
    ticketsSold: checkedInData?.soldCount || 0,
    totalTickets: checkedInData?.totalTicketQuantity || 0,
    checkInCount: checkedInData?.checkedInCount || 0,
    totalAttendees: checkedInData?.soldCount || 0,
  };
  const revenueData: RevenueData[] =
    incomeData?.incomes?.map((income) => ({
      date: income.date || "",
      amount: (income.amount || 0) / 1000,
    })) || [];

  const maxRevenue = Math.max(...revenueData.map((d) => d.amount || 0), 1);
  // 載入活動資料
  const loadActivityData = useCallback(async () => {
    try {
      const numericEventId = Number.parseInt(eventId);
      if (Number.isNaN(numericEventId)) {
        throw new Error("無效的活動 ID");
      }

      const [activityResponse, incomeResponse, checkedInResponse] = await Promise.all([
        getApiV1ActivitiesByActivityId({
          path: { activityId: numericEventId },
        }),
        getApiV1ActivitiesByActivityIdIncome({
          path: { activityId: numericEventId },
          query: { statisticsPeriod }, // 使用狀態中的週期設定
        }),
        getApiV1ActivitiesByActivityIdCheckedIn({
          path: { activityId: numericEventId },
        }),
      ]);

      if (activityResponse.error) {
        throw new Error(activityResponse.error.message || "無法載入活動資料");
      }

      if (incomeResponse.error) {
        console.warn("無法載入收入資料:", incomeResponse.error.message);
      }

      if (checkedInResponse.error) {
        console.warn("無法載入報到資料:", checkedInResponse.error.message);
      }

      if (activityResponse.data?.data) {
        setActivityData(activityResponse.data.data);
        setCoverImageUrl(activityResponse.data.data.cover || "");
      }

      if (incomeResponse.data?.data) {
        setIncomeData(incomeResponse.data.data);
      }

      if (checkedInResponse.data?.data) {
        setCheckedInData(checkedInResponse.data.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, handleError, statisticsPeriod]);

  const loadCheckedInData = useCallback(async () => {
    try {
      const numericEventId = Number.parseInt(eventId);
      if (Number.isNaN(numericEventId)) {
        return;
      }

      const checkedInResponse = await getApiV1ActivitiesByActivityIdCheckedIn({
        path: { activityId: numericEventId },
      });

      if (checkedInResponse.error) {
        console.warn("無法載入報到資料:", checkedInResponse.error.message);
      } else if (checkedInResponse.data?.data) {
        setCheckedInData(checkedInResponse.data.data);
      }
    } catch (error) {
      console.warn("載入報到資料時發生錯誤:", error);
    }
  }, [eventId]);

  const loadIncomeData = useCallback(
    async (period: "d" | "w") => {
      try {
        const numericEventId = Number.parseInt(eventId);
        if (Number.isNaN(numericEventId)) {
          throw new Error("無效的活動 ID");
        }

        const incomeResponse = await getApiV1ActivitiesByActivityIdIncome({
          path: { activityId: numericEventId },
          query: { statisticsPeriod: period },
        });

        if (incomeResponse.error) {
          console.warn("無法載入收入資料:", incomeResponse.error.message);
        } else if (incomeResponse.data?.data) {
          setIncomeData(incomeResponse.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [eventId, handleError]
  );

  // 處理統計週期變更
  const handlePeriodChange = useCallback(
    (period: "d" | "w") => {
      setStatisticsPeriod(period);
      loadIncomeData(period);
    },
    [loadIncomeData]
  );

  // 處理封面圖片上傳
  const handleCoverUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        activityData?.status === ActivityStatus.ENDED ||
        activityData?.status === ActivityStatus.CANCELED
      ) {
        return;
      }

      const file = e.target.files?.[0];
      if (!file) return;

      // 檔案大小驗證 (4MB)
      if (file.size > 4 * 1024 * 1024) {
        toast.error("檔案大小不能超過 4MB");
        return;
      }

      // 檔案類型驗證
      if (!file.type.startsWith("image/")) {
        toast.error("請上傳圖片檔案");
        return;
      }

      setIsUploading(true);

      try {
        const numericEventId = Number.parseInt(eventId);
        if (Number.isNaN(numericEventId)) {
          throw new Error("無效的活動 ID");
        }

        const response = await postApiV1ActivitiesByActivityIdCover({
          path: { activityId: numericEventId },
          body: { cover: file },
        });

        if (response.error) {
          throw new Error(response.error.message || "上傳封面圖片失敗");
        }

        if (response.data?.data) {
          setCoverImageUrl(response.data.data);
          toast.success("封面圖片上傳成功");
          // 重新載入活動資料以更新其他相關信息
          loadActivityData();
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsUploading(false);
        // 清空檔案輸入框
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [eventId, handleError, loadActivityData]
  );

  // 觸發檔案選擇
  const handleCoverClick = () => {
    if (
      activityData?.status === ActivityStatus.ENDED ||
      activityData?.status === ActivityStatus.CANCELED
    ) {
      toast.error("無法編輯已結束或已取消的活動");
      return;
    }

    fileInputRef.current?.click();
  };

  // 處理編輯活動按鈕點擊
  const handleEditEvent = () => {
    router.push(`/organizer/events/${eventId}/edit/basicinfo`);
  };

  // 狀態轉換函數
  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "草稿";
      case "published":
        return "已發布";
      case "ended":
        return "已結束";
      case "canceled":
        return "已取消";
      default:
        return status;
    }
  };

  // 初始載入
  useEffect(() => {
    loadActivityData();
  }, [loadActivityData]);

  // 設定 checkin 資料自動重新載入（每10分鐘）
  useEffect(() => {
    // 清除之前的定時器（如果存在）
    if (checkinIntervalRef.current) {
      clearInterval(checkinIntervalRef.current);
    }

    // 設定新的定時器，每10分鐘執行一次
    checkinIntervalRef.current = setInterval(
      () => {
        loadCheckedInData();
      },
      10 * 60 * 1000
    ); // 10分鐘 = 10 * 60 * 1000 毫秒

    // 清理函數，組件卸載時清除定時器
    return () => {
      if (checkinIntervalRef.current) {
        clearInterval(checkinIntervalRef.current);
        checkinIntervalRef.current = null;
      }
    };
  }, [loadCheckedInData]);

  // 如果正在載入，顯示載入狀態
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-lg text-gray-600">載入總覽資料中...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">{activityData?.title || "活動標題"}</h1>
      </div>

      <div className="text-sm text-muted-foreground mb-6">
        {activityData?.startTime && activityData?.endTime ? (
          <>
            {new Date(activityData.startTime).toLocaleDateString("zh-TW", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              weekday: "short",
            })}
            {new Date(activityData.startTime).toLocaleTimeString("zh-TW", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            -
            {new Date(activityData.endTime).toLocaleDateString("zh-TW", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              weekday: "short",
            })}
            {new Date(activityData.endTime).toLocaleTimeString("zh-TW", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </>
        ) : (
          "活動時間未設定"
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側區域 */}
        <div className="col-span-1">
          {/* 活動封面上傳 */}
          <Card className="bg-card border border-border mb-3">
            <CardContent className="p-6">
              <div
                className={`relative h-48 border-2 border-dashed border-border rounded-lg transition-colors cursor-pointer ${
                  isUploading ? "bg-gray-100" : "bg-background hover:bg-accent/50"
                }`}
                onClick={handleCoverClick}
              >
                {coverImageUrl ? (
                  <>
                    <img
                      src={coverImageUrl}
                      alt="活動封面"
                      className="w-full h-full object-cover rounded-lg"
                      onError={() => setCoverImageUrl("")}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center group">
                      <div className="hidden group-hover:flex items-center bg-white/90 px-3 py-2 rounded-md">
                        <Upload className="h-4 w-4 text-gray-700 mr-2" />
                        <span className="text-sm text-gray-700">更換封面</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    {isUploading ? (
                      <>
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-2" />
                        <p className="text-sm text-muted-foreground">上傳中...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">上傳活動封面圖</p>
                        <p className="text-xs text-muted-foreground">上傳 1000 * 540px</p>
                        <p className="text-xs text-muted-foreground">格式為 PNG/JPG</p>
                        <p className="text-xs text-muted-foreground">檔案小於 4 MB之主視覺</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={isUploading}
                />
              </div>
            </CardContent>
          </Card>
          {/* 操作按鈕 */}
          <div className="flex flex-col gap-2 mb-6">
            <Button
              variant="outline"
              className="flex-1 bg-neutral-800 text-white hover:bg-neutral-900 hover:text-white hidden"
            >
              <Eye className="h-4 w-4 mr-2" />
              瀏覽
            </Button>
            <Button
              className="flex-1"
              onClick={handleEditEvent}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              編輯活動
            </Button>
          </div>
          {/* 統計數據 */}
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              title="活動頁面瀏覽"
              value={stats.views}
              icon={TrendingUp}
            />
            <StatCard
              title="喜歡這個活動"
              value={stats.likes}
              icon={Calendar}
            />
            <StatCard
              title="活動狀態"
              value={getStatusText(stats.status)}
              icon={BarChart3}
            />
          </div>
        </div>

        {/* 右側區域 */}
        <div className="flex flex-col gap-6 col-span-1 lg:col-span-2">
          {/* 售票狀況 */}
          <ProgressStatusCard
            title="售票狀況"
            current={stats.ticketsSold || 0}
            total={stats.totalTickets || 0}
            unit="人"
            progressText="已售出"
            buttons={[]}
          />

          {/* 報到狀況 */}
          <ProgressStatusCard
            title="報到狀況"
            current={stats.checkInCount || 0}
            total={stats.totalAttendees || 0}
            unit="人"
            progressText="已報到"
            buttons={[]}
          />
          {/* 收入統計 */}
          <Card className="bg-card border border-border">
            <CardHeader className="space-y-0 px-8 pt-6 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">收入</CardTitle>
                  <p className="text-sm text-muted-foreground">報名期間統計</p>
                </div>
                <Select
                  value={statisticsPeriod}
                  onValueChange={(value: "d" | "w") => handlePeriodChange(value)}
                >
                  <SelectTrigger className="w-[80px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="d">日</SelectItem>
                    <SelectItem value="w">周</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-6 xl:px-8 pb-6 pt-4">
              <div className="space-y-4">
                {revenueData.length > 0 ? (
                  <div className="flex items-end justify-between gap-4">
                    {revenueData.map((data) => {
                      const height = Math.max((data.amount / maxRevenue) * 100, 5);
                      const displayAmount = data.amount.toFixed(1);
                      return (
                        <div
                          key={data.date}
                          className="flex flex-col items-center flex-1 w-10 md:w-12 xl:w-[93px]"
                        >
                          <div className="relative h-32 flex flex-col items-center justify-end w-full gap-2">
                            <div className="text-neutral-600 text-sm  whitespace-nowrap z-10">
                              {displayAmount}K
                            </div>
                            <div
                              className="bg-primary rounded-md w-full transition-all duration-300 hover:bg-primary/80 cursor-pointer relative"
                              style={{
                                height: `${height}%`,
                                minHeight: "4px",
                              }}
                            />
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground text-center break-all">
                            {data.date}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暫無收入數據</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
