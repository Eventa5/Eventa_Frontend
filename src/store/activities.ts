import { getApiV1Activities } from "@/services/api/client/sdk.gen";
import type { ActivitiesResponse } from "@/services/api/client/types.gen";
import { create } from "zustand";

interface ActivitiesQueryParams {
  page: number;
  limit: number;
  categoryId?: number;
  keyword?: string;
  status?: string;
}

interface ActivitiesState {
  activities: ActivitiesResponse[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  hasMore: boolean;
  isFirstPageLoaded: boolean;
  isInfiniteScrollEnabled: boolean;
  fetchOtherActivities: (page?: number, status?: string) => Promise<void>;
  resetOtherActivities: () => void;
  enableInfiniteScroll: () => void;
}

export const useActivitiesStore = create<ActivitiesState>((set, get) => ({
  activities: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  isFirstPageLoaded: false,
  isInfiniteScrollEnabled: false,

  fetchOtherActivities: async (page = 1, status?: string) => {
    const currentState = get();

    // 如果正在載入中，不要重複載入
    if (currentState.isLoading) {
      return;
    }

    // 如果是第一頁且已經載入過，則不重新載入
    if (page === 1 && currentState.isFirstPageLoaded) {
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // 建構 API 查詢參數
      const queryParams: ActivitiesQueryParams = {
        page,
        limit: 8,
        status: "published",
      };

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
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  resetOtherActivities: () => {
    set({
      activities: [],
      page: 1,
      hasMore: true,
      error: null,
      isFirstPageLoaded: false,
      isInfiniteScrollEnabled: false,
    });
  },

  enableInfiniteScroll: () => {
    set({ isInfiniteScrollEnabled: true });
  },
}));
