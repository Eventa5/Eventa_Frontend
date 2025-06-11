"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getApiV1ActivitiesByActivityId,
  patchApiV1ActivitiesByActivityIdType,
} from "@/services/api/client/sdk.gen";
import { useDialogStore } from "@/store/dialog";
import { useErrorHandler } from "@/utils/error-handler";
import { Camera, ExternalLink, UserCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventPlaceTypePage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  // 錯誤處理
  const { handleError } = useErrorHandler();
  const { showError } = useDialogStore();

  // 本地狀態
  const [eventType, setEventType] = useState<string>("online");
  const [streamLink, setStreamLink] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activityData, setActivityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 載入活動資料
  useEffect(() => {
    const loadActivityData = async () => {
      try {
        const numericEventId = Number.parseInt(eventId);
        if (Number.isNaN(numericEventId)) {
          throw new Error("無效的活動 ID");
        }

        const response = await getApiV1ActivitiesByActivityId({
          path: { activityId: numericEventId },
        });

        if (response.error) {
          throw new Error(response.error.message || "載入活動資料失敗");
        }

        setActivityData(response.data.data);

        // 根據活動資料設置表單狀態
        if (response.data.data) {
          // 安全地訪問可能不存在的屬性
          const data = response.data.data;
          setEventType(data.isOnline ? "online" : "physical");
          setStreamLink(data.livestreamUrl || "");
        }

        setIsLoading(false);
      } catch (error) {
        handleError(error);
        setIsLoading(false);
      }
    };

    if (eventId) {
      loadActivityData();
    }
  }, [eventId, handleError]);

  // 活動形式選項
  const eventTypes = [
    { value: "online", label: "線上活動" },
    { value: "physical", label: "線下活動" },
  ];

  // 處理活動類型變更
  const handleEventTypeChange = (value: string) => {
    setEventType(value);
    // 如果切換到線下活動，清空直播連結
    if (value === "physical") {
      setStreamLink("");
    }
  };

  // 處理表單提交
  const handleSubmit = async () => {
    const numericEventId = Number.parseInt(eventId);
    if (Number.isNaN(numericEventId)) {
      showError("無效的活動 ID");
      return;
    }

    if (!activityData) {
      showError("活動資料載入中，請稍後再試");
      return;
    }

    setIsUpdating(true);
    try {
      const isOnline = eventType === "online";

      // 更新活動形式
      const response = await patchApiV1ActivitiesByActivityIdType({
        path: { activityId: numericEventId },
        body: {
          isOnline: isOnline,
          livestreamUrl: isOnline ? streamLink : undefined,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "更新活動形式失敗");
      }

      toast.success("活動形式更新成功");
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 檢查是否可以進行下一步
  const canProceed = eventType && (eventType !== "online" || streamLink.trim());

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-lg text-gray-600">載入中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">編輯活動形式</h1>

      <div className="flex flex-col h-full gap-8">
        {/* 活動形式選擇 */}
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center">
            <span className="text-red-500 mr-1">*</span>
            活動形式
          </p>
          <Select
            value={eventType}
            onValueChange={handleEventTypeChange}
          >
            <SelectTrigger className="w-full bg-gray-100 border-gray-300">
              <SelectValue placeholder="線上活動" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 直播連結欄位 - 僅在線上活動時顯示 */}
        {eventType === "online" && (
          <div className="space-y-2 flex-grow">
            <p className="text-sm font-medium flex items-center">
              <span className="text-red-500 mr-1">*</span>
              直播連結
            </p>
            <input
              type="text"
              value={streamLink}
              onChange={(e) => setStreamLink(e.target.value)}
              placeholder="請輸入直播連結"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        )}

        {/* 服務內容區塊 - 僅在線下活動時顯示 */}
        {eventType === "physical" && (
          <div className="p-6 bg-white rounded-lg border border-gray-200 flex-grow">
            <h3 className="text-lg mb-5">我們的服務</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium mb-2">攝影服務</h4>
                    <p className="text-sm text-gray-500">活動現場攝影、即時修圖</p>
                  </div>
                  <div className="shrink-0 w-[100px] h-[80px] bg-gray-200 flex items-center justify-center rounded-md">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-blue-500 text-sm flex items-center"
                  >
                    瞭解更多
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium mb-2">大型展會驗票服務</h4>
                    <p className="text-sm text-gray-500">
                      自助報到機、RFID 感應串接、識別證即時列印
                    </p>
                  </div>
                  <div className="shrink-0 w-[100px] h-[80px] bg-gray-200 flex items-center justify-center rounded-md">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-blue-500 text-sm flex items-center"
                  >
                    瞭解更多
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 導航按鈕 */}
        <div className="flex justify-center mt-8 border-t border-gray-200 pt-8">
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || isUpdating}
            className={`${
              canProceed && !isUpdating
                ? "bg-[#FFD56B] hover:bg-[#FFCA28] cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            } text-[#262626] rounded-lg w-full py-2 text-base font-normal transition-colors h-auto`}
          >
            {isUpdating ? "更新中..." : "儲存"}
          </Button>
        </div>
      </div>
    </div>
  );
}
