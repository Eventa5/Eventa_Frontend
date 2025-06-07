"use client";

import { Button } from "@/components/ui/button";
import { useStepGuard } from "@/hooks/use-step-guard";
import {
  getApiV1Categories,
  patchApiV1ActivitiesByActivityIdCategories,
} from "@/services/api/client/sdk.gen";
import { useCreateEventStore } from "@/store/create-event";
import { useDialogStore } from "@/store/dialog";
import { useErrorHandler } from "@/utils/error-handler";
import { Info } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// 分類介面
interface Category {
  id: number;
  name: string;
  icon: string;
  image?: string;
}

// 主題圖標組件
const CategoryIcon = ({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: string;
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
        <div
          className={`icon-${icon} !text-[22px] ${selected ? "text-blue-500" : "text-gray-700"}`}
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

  // 步驟保護：確保用戶按順序完成步驟
  useStepGuard("category", eventId);

  // 使用 store 管理狀態
  const { activityData, setPageCompleted, loadEventData, isLoading, error } = useCreateEventStore();

  // 錯誤處理
  const { handleError } = useErrorHandler();
  const { showError } = useDialogStore();

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // 載入分類資料
  const loadCategories = useCallback(async () => {
    setIsCategoriesLoading(true);
    try {
      const response = await getApiV1Categories();

      if (response.error?.status === false) {
        throw new Error(response.error?.message || "獲取分類失敗");
      }

      if (response.data?.data) {
        const categoriesData = response.data.data.map((cat) => ({
          id: cat.id || 0,
          name: cat.name || "",
          icon: cat.icon || "",
          image: cat.image,
        }));
        setCategories(categoriesData);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    if (!activityData) {
      loadEventData();
    }
  }, [activityData, loadEventData]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (activityData?.categories) {
      const categoryIds = activityData.categories
        .map((cat) => cat.id)
        .filter((id): id is number => id !== undefined);
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

  // 處理下一步按鈕，調用 API 更新資料
  const handleNext = async () => {
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

      if (response.error?.status === false) {
        throw new Error(response.error?.message || "更新活動主題失敗");
      }

      // 標記此步驟為完成
      setPageCompleted("category", true);

      // 重新載入活動資料以獲取最新資訊
      await loadEventData();

      // 跳轉到下一步
      router.push(`/create-event/${eventId}/basicinfo`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 返回上一步
  const handleBack = () => {
    router.push(`/create-event/${eventId}/eventplacetype`);
  };

  // 如果正在載入活動資料或分類資料，顯示載入中
  if ((isLoading && !activityData) || isCategoriesLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-lg text-gray-600">載入資料中...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-y-10 items-center">
      <div>
        <h1 className="text-xl font-medium mb-1">選擇活動主題（最多選擇兩個）</h1>
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
        {categories.map((category) => (
          <CategoryIcon
            key={category.id}
            icon={category.icon}
            label={category.name}
            selected={selectedCategories.includes(category.id)}
            onClick={() => toggleCategory(category.id)}
          />
        ))}
      </div>

      {/* 導航按鈕 */}
      <div className="flex justify-between mt-6 border-t border-gray-200 pt-6 w-full">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isUpdating}
          className="text-[#262626] border-gray-300 rounded-lg w-[140px] md:w-[160px] py-2 md:py-4 text-base font-normal transition-colors cursor-pointer h-auto hover:bg-gray-100"
        >
          返回上一步
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedCategories.length === 0 || isUpdating}
          className="bg-[#FFD56B] text-[#262626] rounded-lg w-[140px] md:w-[160px] py-2 md:py-4 text-base font-normal hover:bg-[#FFCA28] transition-colors cursor-pointer h-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "更新中..." : "下一步"}
        </Button>
      </div>
    </div>
  );
}
