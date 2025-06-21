"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormSection } from "@/components/ui/form-field";
import { type BasicInfoFormData, basicInfoSchema } from "@/features/organizer/schemas";
import { HOUR_OPTIONS, MINUTE_OPTIONS } from "@/features/shared/constants/date";
import type { ActivityResponse } from "@/services/api/client";
import {
  getApiV1ActivitiesByActivityId,
  patchApiV1ActivitiesByActivityIdBasic,
  postApiV1ActivitiesByActivityIdCover,
} from "@/services/api/client/sdk.gen";
import { useDialogStore } from "@/store/dialog";
import { useOrganizerStore } from "@/store/organizer";
import { combineDateTime, parseDateTime } from "@/utils/date";
import { useErrorHandler } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, MapPin, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

// 固定選項
const TIMEZONE_OPTIONS = [{ value: "(GMT+08:00) 台北", label: "(GMT+08:00) 台北" }];
const REGION_OPTIONS = [{ value: "台灣", label: "台灣" }];

export default function BasicInfoPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  // 錯誤處理
  const { handleError } = useErrorHandler();
  const { showError } = useDialogStore();

  // 從 organizer store 獲取主辦單位資訊
  const currentOrganizerInfo = useOrganizerStore((s) => s.currentOrganizerInfo);

  // 本地狀態
  const [isUpdating, setIsUpdating] = useState(false);
  const [activityData, setActivityData] = useState<ActivityResponse | null>(null);
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
        setActivityData(response.data.data || null);

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

  // 解析活動時間
  const startTimeData = useMemo(() => {
    return parseDateTime(activityData?.startTime);
  }, [activityData?.startTime]);

  const endTimeData = useMemo(() => {
    return parseDateTime(activityData?.endTime);
  }, [activityData?.endTime]);

  // 獲取明天的日期
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { isValid },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      organizerName: currentOrganizerInfo?.name || "",
      eventName: "",
      timezone: "(GMT+08:00) 台北",
      startDate: tomorrowDate,
      endDate: tomorrowDate,
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
      eventTags: [],
      eventRegion: "台灣",
      eventLocation: "",
    },
    mode: "all",
  });
  // 當活動資料載入完成時，重置表單預設值
  useEffect(() => {
    if (activityData && currentOrganizerInfo) {
      setValue("organizerName", currentOrganizerInfo.name || "");
      setValue("eventName", activityData.title || "");
      setValue("startDate", startTimeData?.date || tomorrowDate, {
        shouldTouch: true,
      });
      setValue("endDate", endTimeData?.date || tomorrowDate, {
        shouldTouch: true,
      });
      setValue("startHour", startTimeData?.hour || "");
      setValue("startMinute", startTimeData?.minute || "");
      setValue("endHour", endTimeData?.hour || "");
      setValue("endMinute", endTimeData?.minute || "");
      setValue("eventTags", activityData.tags || []);
      setValue("eventLocation", activityData.location || "");
    }
  }, [activityData, currentOrganizerInfo, startTimeData, endTimeData, tomorrowDate, setValue]);

  // 監看地址變化
  const eventLocation = useWatch({
    control,
    name: "eventLocation",
  });

  // 封面圖片狀態
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  // 從活動資料設置封面圖片
  useEffect(() => {
    if (activityData?.cover && !coverImageUrl) {
      setCoverImageUrl(activityData.cover);
    }
  }, [activityData?.cover, coverImageUrl]);

  // 圖片上傳處理
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];

        if (file.size > 5 * 1024 * 1024) {
          alert("圖片大小不能超過 5MB");
          return;
        }

        if (coverImageUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(coverImageUrl);
        }

        setCoverImage(file);
        setCoverImageUrl(URL.createObjectURL(file));
      }
    },
    [coverImageUrl]
  );

  // 表單提交
  const onSubmit = useCallback(
    async (data: BasicInfoFormData) => {
      const numericEventId = Number.parseInt(eventId);
      if (Number.isNaN(numericEventId)) {
        showError("無效的活動 ID");
        return;
      }

      setIsUpdating(true);

      try {
        // 組合開始和結束時間
        const startTime = combineDateTime(data.startDate, data.startHour, data.startMinute);
        const endTime = combineDateTime(data.endDate, data.endHour, data.endMinute);

        // 準備 API 資料
        const updateData = {
          title: data.eventName,
          location: data.eventLocation,
          startTime,
          endTime,
          tags: data.eventTags,
        };

        // 調用 API 更新基本資料
        const response = await patchApiV1ActivitiesByActivityIdBasic({
          path: { activityId: numericEventId },
          body: updateData,
        });

        if (response.error) {
          throw new Error(response.error.message || "更新基本資料失敗");
        }

        // 如果有封面圖片，則上傳
        if (coverImage) {
          const coverResponse = await postApiV1ActivitiesByActivityIdCover({
            path: { activityId: numericEventId },
            body: {
              cover: coverImage,
            },
          });

          if (coverResponse.error) {
            throw new Error(coverResponse.error.message || "上傳封面圖片失敗");
          }
        }

        toast.success("基本資訊更新成功");
      } catch (error) {
        handleError(error);
      } finally {
        setIsUpdating(false);
      }
    },
    [eventId, coverImage, router, handleError, showError]
  );

  // 地圖內容
  const mapContent = useMemo(() => {
    if (!eventLocation || !eventLocation.trim()) {
      return (
        <div className="text-gray-500 flex flex-col items-center">
          <MapPin size={48} />
          <p className="mt-2 text-sm">請輸入地址以顯示地圖</p>
        </div>
      );
    }

    return (
      <div className="relative w-full">
        <iframe
          title="活動地圖"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${encodeURIComponent(eventLocation)}&output=embed`}
          onError={() => {
            // 靜默處理 iframe 錯誤
          }}
        />
      </div>
    );
  }, [eventLocation]);

  // 如果正在載入活動資料，顯示載入中
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-lg text-gray-600">載入活動資料中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">編輯活動基本資訊</h1>

      {/* 封面圖片上傳區域 */}
      <div className="bg-gray-100 h-[450px] mb-6 flex items-center justify-center relative overflow-hidden">
        {coverImageUrl ? (
          <div className="w-full h-full absolute inset-0">
            <img
              src={coverImageUrl}
              alt="活動封面"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <label
                htmlFor="cover-upload"
                className="cursor-pointer bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-md flex items-center"
              >
                <Upload
                  size={16}
                  className="mr-2"
                />
                更換封面圖片
              </label>
            </div>
          </div>
        ) : (
          <label
            htmlFor="cover-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded-md mb-2">
              <ImageIcon
                size={32}
                className="text-gray-500"
              />
            </div>
            <span className="text-sm text-gray-500">點擊上傳活動封面圖片</span>
          </label>
        )}
        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* 主辦單位名稱 */}
        <FormSection
          title="主辦單位名稱"
          required
        >
          <FormField
            control={control}
            name="organizerName"
            type="input"
            disabled={true}
            className="bg-gray-100"
          />
        </FormSection>

        {/* 活動名稱 */}
        <FormSection
          title="活動名稱"
          required
        >
          <FormField
            control={control}
            name="eventName"
            type="input"
          />
        </FormSection>

        {/* 時區 */}
        <FormSection
          title="活動時區"
          required
        >
          <FormField
            control={control}
            name="timezone"
            type="select"
            placeholder="(GMT+08:00) 台北"
            options={TIMEZONE_OPTIONS}
            disabled={true}
          />
        </FormSection>

        {/* 活動時間 */}
        <FormSection
          title="活動時間"
          required
        >
          <div className="space-y-4">
            {/* 開始時間 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">開始時間</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={control}
                  name="startDate"
                  type="date"
                  placeholder="選擇開始日期"
                  footerText="選擇活動開始日期"
                  className="col-span-1"
                  trigger={trigger}
                  triggerFields={["endDate"]}
                />
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="startHour"
                      type="select"
                      placeholder="時"
                      options={HOUR_OPTIONS}
                      trigger={trigger}
                      triggerFields={["endDate"]}
                    />
                    <FormField
                      control={control}
                      name="startMinute"
                      type="select"
                      placeholder="分"
                      options={MINUTE_OPTIONS}
                      trigger={trigger}
                      triggerFields={["endDate"]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 結束時間 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">結束時間</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={control}
                  name="endDate"
                  type="date"
                  placeholder="選擇結束日期"
                  footerText="選擇活動結束日期"
                  className="col-span-1"
                />
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={control}
                      name="endHour"
                      type="select"
                      placeholder="時"
                      options={HOUR_OPTIONS}
                      trigger={trigger}
                      triggerFields={["endDate"]}
                    />
                    <FormField
                      control={control}
                      name="endMinute"
                      type="select"
                      placeholder="分"
                      options={MINUTE_OPTIONS}
                      trigger={trigger}
                      triggerFields={["endDate"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* 活動標籤 */}
        <FormSection title="活動標籤">
          <FormField
            control={control}
            name="eventTags"
            type="tags"
            placeholder="輸入活動標籤"
            maxTags={5}
          />
        </FormSection>

        {/* 活動國家 */}
        <FormSection
          title="活動國家"
          required
        >
          <FormField
            control={control}
            name="eventRegion"
            type="select"
            placeholder="國家/地區"
            options={REGION_OPTIONS}
            disabled={true}
          />
        </FormSection>

        {/* 詳細地址 */}
        <FormSection title="詳細地址">
          <FormField
            control={control}
            name="eventLocation"
            type="input"
            placeholder="完整地址"
          />
        </FormSection>

        {/* Google Maps 預覽 */}
        <div className="h-[400px] bg-gray-200 flex items-center justify-center mb-4 mt-6 overflow-hidden rounded-md">
          {mapContent}
        </div>

        {/* 導航按鈕 */}
        <div className="flex justify-center border-t border-gray-200 pt-6">
          <Button
            type="submit"
            disabled={!isValid || isUpdating}
            className={`${
              isValid && !isUpdating
                ? "bg-[#FFD56B] hover:bg-[#FFCA28] cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            } text-[#262626] rounded-lg w-full py-2 text-base font-normal transition-colors h-auto`}
          >
            {isUpdating ? "更新中..." : "儲存"}
          </Button>
        </div>
      </form>
    </div>
  );
}
