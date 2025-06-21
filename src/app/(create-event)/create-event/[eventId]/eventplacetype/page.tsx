"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patchApiV1ActivitiesByActivityIdType } from "@/services/api/client/sdk.gen";
import { useCreateEventStore } from "@/store/create-event";
import { useErrorHandler } from "@/utils/error-handler";
import { Camera, ExternalLink, UserCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventPlaceTypePage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const {
    organizationInfo,
    currentEventId,
    createNewEvent,
    setCurrentEventId,
    activityData,
    loadEventData,
    isLoading,
  } = useCreateEventStore();

  // 錯誤處理
  const { handleError } = useErrorHandler();

  // 本地狀態
  const [eventType, setEventType] = useState<string>("online");
  const [streamLink, setStreamLink] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false); // 檢查是否有主辦單位資訊並載入活動資料
  useEffect(() => {
    // 如果是編輯現有活動（eventId 不是 "new"），設置當前活動ID並載入資料
    if (eventId !== "new") {
      const numericEventId = Number.parseInt(eventId);
      if (!Number.isNaN(numericEventId)) {
        setCurrentEventId(numericEventId);

        // 如果當前活動ID不同且尚未載入資料，需要重新載入資料
        if (currentEventId !== numericEventId && !hasLoadedData) {
          loadEventData();
          setHasLoadedData(true);
        }
      }
    }
  }, [eventId, currentEventId, setCurrentEventId, loadEventData, hasLoadedData]);

  // 當活動資料載入完成時，同步 isOnline 狀態到本地狀態
  useEffect(() => {
    if (activityData && eventId !== "new") {
      // 同步活動形式
      const activityEventType = activityData.isOnline ? "online" : "physical";
      setEventType(activityEventType);

      // 如果是線上活動，同步直播連結
      if (activityData.isOnline && activityData.livestreamUrl) {
        setStreamLink(activityData.livestreamUrl);
      }
    }
  }, [activityData, eventId]);

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

  // 處理表單提交，建立或更新活動並跳轉到下一步
  const handleNext = async () => {
    if (!organizationInfo) {
      router.push("/create-event/organizer");
      return;
    }

    setIsCreating(true);

    try {
      const isOnline = eventType === "online";
      const livestreamUrl = isOnline ? streamLink : undefined;

      if (eventId === "new") {
        // 建立新活動
        const newEventId = await createNewEvent(isOnline, livestreamUrl);

        // 重新載入活動資料
        setCurrentEventId(newEventId);
        await loadEventData();

        // 跳轉到下一步
        router.push(`/create-event/${newEventId}/category`);
      } else {
        // 更新現有活動
        const numericEventId = Number.parseInt(eventId);
        if (!Number.isNaN(numericEventId) && activityData) {
          const response = await patchApiV1ActivitiesByActivityIdType({
            path: { activityId: numericEventId },
            body: {
              isOnline,
              livestreamUrl,
            },
          });
          if (response.error?.status === false) {
            throw new Error(response.error.message || "更新活動失敗，請稍後再試");
          }

          // 重新載入活動資料
          await loadEventData();

          // 跳轉到下一步
          router.push(`/create-event/${eventId}/category`);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : eventId === "new"
            ? "建立活動失敗，請稍後再試"
            : "更新活動失敗，請稍後再試";

      handleError(error, {
        customErrorMessage: errorMessage,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // 返回上一步
  const handleBack = () => {
    router.push("/create-event/organizer");
  };

  // 檢查是否可以進行下一步
  const canProceed =
    eventType &&
    (eventType !== "online" || streamLink.trim()) &&
    // 如果是編輯現有活動，必須等活動資料載入完成
    (eventId === "new" || (eventId !== "new" && activityData && !isLoading));

  // 如果沒有主辦單位資訊，顯示載入中
  if (!organizationInfo) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-lg text-gray-600">載入中...</div>
      </div>
    );
  }

  // 如果是編輯現有活動但活動資料還在載入中，顯示載入中
  if (eventId !== "new" && isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-lg text-gray-600">載入活動資料中...</div>
      </div>
    );
  }

  return (
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
                  <p className="text-sm text-gray-500">自助報到機、RFID 感應串接、識別證即時列印</p>
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
      <div className="flex justify-between mt-8 border-t border-gray-200 pt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isCreating}
          className="text-[#262626] border-gray-300 rounded-lg w-[140px] md:w-[160px] py-2 md:py-4 text-base font-normal transition-colors cursor-pointer h-auto hover:bg-gray-100"
        >
          返回上一步
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed || isCreating}
          className={`${
            canProceed && !isCreating
              ? "bg-[#FFD56B] hover:bg-[#FFCA28] cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          } text-[#262626] rounded-lg w-[140px] md:w-[160px] py-2 md:py-4 text-base font-normal transition-colors h-auto`}
        >
          {isCreating ? "建立中..." : "下一步"}
        </Button>
      </div>
    </div>
  );
}
