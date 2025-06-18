import { getApiV1Activities } from "@/services/api/client/sdk.gen";
import type { ActivitiesResponse } from "@/services/api/client/types.gen";
import { create } from "zustand";

interface SearchActivitiesQueryParams {
  page: number;
  limit: number;
  categoryId?: number;
  keyword?: string;
  status?: string;
}

interface SearchActivitiesState {
  activities: ActivitiesResponse[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  hasMore: boolean;
  isFirstPageLoaded: boolean;
  isInfiniteScrollEnabled: boolean;
  currentCategoryId?: number;
  currentKeyword?: string;
  fetchSearchActivities: (page?: number, categoryId?: number, keyword?: string) => Promise<void>;
  resetSearchActivities: () => void;
  enableInfiniteScroll: () => void;
}

export const useSearchActivitiesStore = create<SearchActivitiesState>((set, get) => ({
  activities: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  isFirstPageLoaded: false,
  isInfiniteScrollEnabled: false,
  currentCategoryId: undefined,
  currentKeyword: undefined,

  fetchSearchActivities: async (page = 1, categoryId?: number, keyword?: string) => {
    const currentState = get();

    // 如果正在載入中，不要重複載入
    if (currentState.isLoading) {
      return;
    }

    // 檢查是否為新的搜尋條件
    const isNewSearch =
      page === 1 &&
      (categoryId !== currentState.currentCategoryId || keyword !== currentState.currentKeyword);

    try {
      set({ isLoading: true, error: null });

      // 如果是新的搜尋條件，重置狀態
      if (isNewSearch) {
        set({
          activities: [],
          page: 1,
          hasMore: true,
          isFirstPageLoaded: false,
          isInfiniteScrollEnabled: false,
          currentCategoryId: categoryId,
          currentKeyword: keyword,
        });
      }

      // 建構 API 查詢參數
      const queryParams: SearchActivitiesQueryParams = {
        page,
        limit: 8,
        status: "published",
      };

      // 如果有分類 ID，加入 categoryId 參數
      if (categoryId) {
        queryParams.categoryId = categoryId;
      }

      if (keyword) {
        queryParams.keyword = keyword;
      }

      const response = await getApiV1Activities({
        query: queryParams,
      });

      const newActivities = response.data?.data || [];

      set((state) => ({
        activities: page === 1 ? newActivities : [...state.activities, ...newActivities],
        page,
        hasMore: newActivities.length === 8,
        isLoading: false,
        isFirstPageLoaded: page === 1 ? true : state.isFirstPageLoaded,
        currentCategoryId: categoryId,
        currentKeyword: keyword,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  resetSearchActivities: () => {
    set({
      activities: [],
      page: 1,
      hasMore: true,
      error: null,
      isFirstPageLoaded: false,
      isInfiniteScrollEnabled: false,
      currentCategoryId: undefined,
      currentKeyword: undefined,
    });
  },

  enableInfiniteScroll: () => {
    set({ isInfiniteScrollEnabled: true });
  },
}));
