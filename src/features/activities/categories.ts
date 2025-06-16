import { getApiV1Categories } from "@/services/api/client/sdk.gen";
import type { CategoriesResponse } from "@/services/api/client/types.gen";
import useSWR from "swr";

// 類別資料的類型定義
export type FormattedCategory = {
  id: number;
  name: string;
  imageUrl: string;
};

// 錯誤訊息常數
export const ERROR_MESSAGES = {
  FETCH_ERROR: "無法獲取類別資料，請稍後再試",
  VALIDATION_ERROR: "類別資料格式不正確",
  EMPTY_DATA: "目前沒有可用的類別資料",
} as const;

// 使用 API 獲取類別資料的函數
export const fetchCategories = async (): Promise<CategoriesResponse[]> => {
  try {
    const response = await getApiV1Categories();

    // 檢查回應是否成功
    if (!response.data) {
      throw new Error(ERROR_MESSAGES.FETCH_ERROR);
    }

    // 檢查資料是否為空
    if (!response.data.data || response.data.data.length === 0) {
      throw new Error(ERROR_MESSAGES.EMPTY_DATA);
    }

    return response.data.data;
  } catch (error) {
    // 處理 API 錯誤
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(ERROR_MESSAGES.FETCH_ERROR);
  }
};

// 將 API 回傳的類別資料轉換為 CategorySwiper 需要的格式
export const formatCategories = (categories: CategoriesResponse[]): FormattedCategory[] => {
  try {
    return categories.map((category) => {
      // 驗證必要欄位
      if (!category.name || !category.image || !category.id) {
        throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
      }

      return {
        id: category.id,
        name: category.name,
        imageUrl: category.image,
      };
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
  }
};

// 使用 SWR 獲取類別資料的 Hook
export const useCategories = () => {
  const {
    data: categories = [],
    error,
    isLoading,
  } = useSWR<CategoriesResponse[]>("categories", {
    fetcher: fetchCategories,
  });

  // 處理資料轉換
  let formattedCategories: FormattedCategory[] = [];
  let formatError = null;

  try {
    formattedCategories = formatCategories(categories);
  } catch (error) {
    formatError = error instanceof Error ? error.message : ERROR_MESSAGES.VALIDATION_ERROR;
  }

  return {
    categories: formattedCategories,
    error: error || formatError,
    isLoading,
  };
};
