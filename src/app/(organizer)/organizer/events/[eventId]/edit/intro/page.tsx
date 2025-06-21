"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormSection } from "@/components/ui/form-field";
import { type IntroFormData, introSchema } from "@/features/organizer/schemas";
import {
  getApiV1ActivitiesByActivityId,
  patchApiV1ActivitiesByActivityIdContent,
} from "@/services/api/client/sdk.gen";
import { useDialogStore } from "@/store/dialog";
import { ActivityStatus } from "@/types/common";
import { useErrorHandler } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

// 動態導入 QuillEditor，確保只在客戶端渲染
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] border border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">載入編輯器中...</div>
    </div>
  ),
});

export default function IntroPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const [isMounted, setIsMounted] = useState(false);

  // 錯誤處理
  const { handleError } = useErrorHandler();
  const { showError } = useDialogStore();

  // 本地狀態
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
        setIsLoading(false);
      } catch (error) {
        handleError(error);
        setIsLoading(false);
      }
    };

    if (eventId) {
      loadActivityData();
    }
    setIsMounted(true);
  }, [eventId, handleError]);

  // 使用 useForm hook 並整合 zod 驗證
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid },
  } = useForm<IntroFormData>({
    resolver: zodResolver(introSchema),
    mode: "all",
    defaultValues: {
      summary: "",
      description: "",
      notice: "",
    },
  });

  // 當活動資料載入完成時，重置表單預設值
  useEffect(() => {
    if (activityData) {
      const formData = {
        summary: activityData.summary || "",
        description: activityData.descriptionMd || "",
        notice: activityData.notes || "",
      };

      reset(formData);
    }
  }, [activityData, reset]);

  // 監聽字段值變化
  const summary = watch("summary", "");
  const notice = watch("notice", "");
  const summaryLength = summary.length;
  const noticeLength = notice ? notice.length : 0;
  const maxSummaryLength = 250;
  const maxNoticeLength = 500;

  // 處理表單提交
  const onSubmit = useCallback(
    async (data: IntroFormData) => {
      if (
        activityData?.status === ActivityStatus.ENDED ||
        activityData?.status === ActivityStatus.CANCELED
      ) {
        showError("無法編輯已結束或已取消的活動");
        return;
      }

      const numericEventId = Number.parseInt(eventId);
      if (Number.isNaN(numericEventId)) {
        showError("無效的活動 ID");
        return;
      }

      setIsUpdating(true);

      try {
        // 準備 API 資料
        const updateData = {
          summary: data.summary,
          descriptionMd: data.description,
          notes: data.notice,
        };

        // 調用 API 更新活動內容
        const response = await patchApiV1ActivitiesByActivityIdContent({
          path: { activityId: numericEventId },
          body: updateData,
        });

        if (response.error) {
          throw new Error(response.error.message || "更新活動內容失敗");
        }

        toast.success("活動內容更新成功");
      } catch (error) {
        handleError(error);
      } finally {
        setIsUpdating(false);
      }
    },
    [eventId, router, showError, handleError]
  );

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
      <h1 className="text-2xl font-bold mb-6">編輯活動內容介紹</h1>

      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 活動摘要 */}
        <FormSection
          title="活動摘要"
          required
          description="簡明扼要的活動摘要，公開在「活動摘要欄」，以及 Google 搜索的預覽結果。"
        >
          <div className="relative">
            <FormField
              control={control}
              name="summary"
              type="textarea"
              placeholder="請簡述您「活動背包」、「參與者可獲得的經驗」等您認為人之處。"
              maxLength={maxSummaryLength}
              className="min-h-[120px]"
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-400">
              {summaryLength} / {maxSummaryLength}
            </div>
          </div>
        </FormSection>

        {/* 活動簡介 */}
        <FormSection
          title="活動簡介"
          required
          description="你的活動是做甚麼的，為甚麼值得消費者關注，在這個欄位上主要說明這場活動之相關規則。"
        >
          {isMounted ? (
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error, isDirty, isTouched } }) => {
                const showError = error && (isDirty || isTouched);

                return (
                  <div>
                    <QuillEditor
                      value={field.value}
                      onChange={field.onChange}
                      height={500}
                      placeholder="請詳細描述您的活動內容、規則和相關資訊..."
                      className="focus-within:border-[#FFD56B]"
                    />
                    {showError && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
                  </div>
                );
              }}
            />
          ) : (
            <div className="w-full h-[500px] border border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
              <div className="text-gray-500">載入編輯器中...</div>
            </div>
          )}
        </FormSection>

        {/* 注意事項 */}
        <FormSection
          title="注意事項"
          description="本篇文字會通知在電子票券上，可包含溫馨提醒或各種其他人需要注意事項。"
        >
          <div className="relative">
            <FormField
              control={control}
              name="notice"
              type="textarea"
              placeholder=""
              maxLength={maxNoticeLength}
              className="min-h-[120px]"
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-400">
              {noticeLength} / {maxNoticeLength}
            </div>
          </div>
        </FormSection>

        {/* 導航按鈕 */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={
              !isValid ||
              isUpdating ||
              activityData?.status === ActivityStatus.ENDED ||
              activityData?.status === ActivityStatus.CANCELED
            }
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
