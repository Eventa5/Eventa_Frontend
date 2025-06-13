"use client";

import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/features/shared/constants/category";
import {
  getApiV1ActivitiesByActivityId,
  patchApiV1ActivitiesByActivityIdCategories,
} from "@/services/api/client/sdk.gen";
import { useDialogStore } from "@/store/dialog";
import { useErrorHandler } from "@/utils/error-handler";
import { Info } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// 主題圖標組件
const CategoryIcon = ({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 ${
        selected ? "scale-105" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 ${
          selected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
        }`}
      >
        <Icon
          size={28}
          className={selected ? "text-blue-500" : "text-gray-700"}
        />
      </div>
      <span className="text-xs text-gray-700">{label}</span>
    </div>
  );
};

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  // 錯誤處理
  const { handleError } = useErrorHandler();
  const { showError } = useDialogStore();

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
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
  }, [eventId, handleError]);

  // 當活動資料載入完成時，設置已選擇的分類
  useEffect(() => {
    if (activityData?.categories) {
      const categoryIds = activityData.categories
        .map((cat: any) => cat.id)
        .filter((id: any): id is number => id !== undefined);
      setSelectedCategories(categoryIds);
    }
  }, [activityData]);

  // 切換選擇狀態
  const toggleCategory = (categoryId: number) => {
    let newCategories: number[];

    if (selectedCategories.includes(categoryId)) {
      newCategories = selectedCategories.filter((id) => id !== categoryId);
    } else {
      // 最多選擇兩個主題
      if (selectedCategories.length >= 2) {
        newCategories = [...selectedCategories.slice(1), categoryId];
      } else {
        newCategories = [...selectedCategories, categoryId];
      }
    }

    setSelectedCategories(newCategories);
  };

  // 處理提交，調用 API 更新資料
  const handleSubmit = async () => {
    if (selectedCategories.length === 0) return;

    const numericEventId = Number.parseInt(eventId);
    if (Number.isNaN(numericEventId)) {
      showError("無效的活動 ID");
      return;
    }

    setIsUpdating(true);

    try {
      // 調用 API 更新活動主題
      const response = await patchApiV1ActivitiesByActivityIdCategories({
        path: { activityId: numericEventId },
        body: { categoryIds: selectedCategories },
      });

      if (response.error) {
        throw new Error(response.error?.message || "更新活動主題失敗");
      }

      toast.success("活動主題更新成功");
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

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
      <h1 className="text-2xl font-bold mb-6">編輯活動主題</h1>

      <div className="flex flex-col h-full gap-y-10 items-center">
        <div>
          <h2 className="text-xl font-medium mb-1">選擇活動主題（最多選擇兩個）</h2>
          <div className="flex items-center text-gray-500 text-sm">
            <Info
              size={16}
              className="mr-1"
            />
            <span>選擇合適的主題幫助您的活動被更多人發現</span>
          </div>
          {selectedCategories.length > 0 && (
            <div className="mt-2 text-sm text-blue-600">
              已選擇：{selectedCategories.length}/2 個主題
            </div>
          )}
        </div>

        <div className="grid grid-cols-[repeat(3,68px)] md:grid-cols-[repeat(6,68px)] gap-5 w-fit">
          {CATEGORIES.map((category) => (
            <CategoryIcon
              key={category.id}
              icon={category.icon}
              label={category.label}
              selected={selectedCategories.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            />
          ))}
        </div>

        {/* 導航按鈕 */}
        <div className="flex justify-center mt-6 border-t border-gray-200 pt-6 w-full">
          <Button
            onClick={handleSubmit}
            disabled={selectedCategories.length === 0 || isUpdating}
            className="bg-[#FFD56B] text-[#262626] rounded-lg w-full py-2 text-base font-normal hover:bg-[#FFCA28] transition-colors cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "更新中..." : "儲存"}
          </Button>
        </div>
      </div>
    </div>
  );
}
