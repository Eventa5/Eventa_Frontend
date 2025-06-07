import { getApiV1ActivitiesByActivityId, postApiV1Activities } from "@/services/api/client/sdk.gen";
import type { ActivityResponse } from "@/services/api/client/types.gen";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 頁面完成狀態類型
export interface PageCompletionStatus {
  eventplacetype: boolean;
  category: boolean;
  basicinfo: boolean;
  intro: boolean;
  ticketsSetting: boolean;
}

// 主辦單位資訊類型
export interface OrganizationInfo {
  organizationId: number;
  organizationName: string;
}

// 創建活動Store狀態 - 專注於步驟管理和活動資料
interface CreateEventState {
  // 當前編輯的活動ID
  currentEventId: number | null;

  // 主辦單位資訊
  organizationInfo: OrganizationInfo | null;

  // 各頁面完成狀態
  completionStatus: PageCompletionStatus;

  // 從 API 獲取的活動資料
  activityData: ActivityResponse | null;

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // Actions - 基本操作
  setCurrentEventId: (id: number) => void;
  setOrganizationInfo: (info: OrganizationInfo) => void;
  createNewEvent: (isOnline: boolean, livestreamUrl?: string) => Promise<number>; // 建立新活動並返回 ID
  hasUnfinishedEvent: () => boolean; // 檢查是否有未完成的活動
  loadEventData: () => Promise<void>; // 載入活動資料到 store
  setPageCompleted: (page: keyof PageCompletionStatus, completed: boolean) => void;

  // 工具方法
  getOverallProgress: () => number;
  getStepOneProgress: () => boolean;
  getStepTwoProgress: () => boolean;
  isPageCompleted: (page: keyof PageCompletionStatus) => boolean;

  // 重置和清空方法
  resetEventData: (eventId: number) => void;
  clearAllData: () => void;

  // 完成活動創建（在票券設定頁面調用）
  completeEventCreation: () => void;

  // 錯誤處理
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialState = {
  currentEventId: null,
  organizationInfo: null,
  completionStatus: {
    eventplacetype: false,
    category: false,
    basicinfo: false,
    intro: false,
    ticketsSetting: false,
  },
  activityData: null,
  isLoading: false,
  error: null,
};

export const useCreateEventStore = create<CreateEventState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentEventId: (id: number) => {
        set({ currentEventId: id });
      },

      setOrganizationInfo: (info: OrganizationInfo) => {
        set({ organizationInfo: info });
      },

      createNewEvent: async (isOnline: boolean, livestreamUrl?: string): Promise<number> => {
        const { organizationInfo } = get();

        if (!organizationInfo) {
          throw new Error("請先選擇主辦單位");
        }

        set({ isLoading: true, error: null });

        try {
          const response = await postApiV1Activities({
            body: {
              organizationId: organizationInfo.organizationId,
              isOnline,
              livestreamUrl,
            },
          });

          if (response.data?.data?.id) {
            const eventId = response.data.data.id;

            // 設定活動 ID 並初始化狀態
            set({
              currentEventId: eventId,
              completionStatus: {
                eventplacetype: true, // 創建活動時已完成活動形式選擇
                category: false,
                basicinfo: false,
                intro: false,
                ticketsSetting: false,
              },
              activityData: null,
              isLoading: false,
              error: null,
            });

            return eventId;
          }
          throw new Error("建立活動失敗：無法獲取活動 ID");
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "建立活動失敗";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      hasUnfinishedEvent: (): boolean => {
        return Boolean(get().currentEventId);
      },

      loadEventData: async (): Promise<void> => {
        const { currentEventId } = get();

        if (!currentEventId) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await getApiV1ActivitiesByActivityId({
            path: { activityId: currentEventId },
          });

          if (response.data) {
            set({
              activityData: response.data.data,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error("無法獲取活動資料");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "載入活動資料失敗";
          set({ error: errorMessage, isLoading: false });

          // 如果載入失敗，清除無效的 ID
          get().clearAllData();
        }
      },

      setPageCompleted: (page: keyof PageCompletionStatus, completed: boolean) => {
        set((state) => ({
          completionStatus: {
            ...state.completionStatus,
            [page]: completed,
          },
        }));
      },

      getOverallProgress: () => {
        const status = get().completionStatus;
        const completedPages = Object.values(status).filter(Boolean).length;
        const totalPages = Object.keys(status).length;
        return Math.round((completedPages / totalPages) * 100);
      },

      getStepOneProgress: () => {
        const { eventplacetype, category, basicinfo, intro } = get().completionStatus;
        return eventplacetype && category && basicinfo && intro;
      },

      getStepTwoProgress: () => {
        const { ticketsSetting } = get().completionStatus;
        return ticketsSetting;
      },

      isPageCompleted: (page: keyof PageCompletionStatus) => {
        return get().completionStatus[page];
      },

      resetEventData: (eventId: number) => {
        const state = get();
        if (state.currentEventId === eventId) {
          set({ ...initialState });
        }
      },

      clearAllData: () => {
        set({ ...initialState });
      },

      // 活動創建完成，清空所有暫存資料
      completeEventCreation: () => {
        set(initialState);
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "create-event-storage",
      // 只保存必要的狀態到 localStorage
      partialize: (state) => ({
        currentEventId: state.currentEventId,
        organizationInfo: state.organizationInfo,
        completionStatus: state.completionStatus,
      }),
    }
  )
);

// 輔助函數：檢查是否可以訪問指定步驟
// 邏輯：
// 1. 如果步驟已完成，可以訪問（用戶可以回到已完成的步驟）
// 2. 如果步驟未完成，但是下一個應該完成的步驟，可以訪問
// 3. 其他情況不可訪問（不能跳過未完成的步驟）
export const canAccessStep = (stepPath: string): boolean => {
  const store = useCreateEventStore.getState();
  const { completionStatus } = store;

  // 定義步驟順序和對應的完成狀態鍵
  const stepOrder = [
    { path: "eventplacetype", key: "eventplacetype" },
    { path: "category", key: "category" },
    { path: "basicinfo", key: "basicinfo" },
    { path: "intro", key: "intro" },
    { path: "tickets/setting", key: "ticketsSetting" },
  ];

  // 找到當前步驟的索引
  const currentStepIndex = stepOrder.findIndex(
    (step) => step.path === stepPath || stepPath.startsWith(step.path.split("/")[0])
  );

  if (currentStepIndex === -1) return true; // 未知步驟允許訪問

  const currentStepKey = stepOrder[currentStepIndex].key as keyof PageCompletionStatus;

  // 如果當前步驟已完成，允許訪問
  if (completionStatus[currentStepKey]) {
    return true;
  }

  // 如果當前步驟未完成，檢查是否為下一個應該完成的步驟
  // 找到第一個未完成的步驟
  const firstIncompleteStepIndex = stepOrder.findIndex(
    (step) => !completionStatus[step.key as keyof PageCompletionStatus]
  );

  // 如果當前步驟是第一個未完成的步驟，允許訪問
  return currentStepIndex === firstIncompleteStepIndex;
};

// 輔助函數：獲取下一個未完成的步驟路徑
export const getNextIncompleteStep = (eventId: number): string => {
  const store = useCreateEventStore.getState();
  const { completionStatus } = store;

  const steps = [
    { key: "eventplacetype", path: "eventplacetype" },
    { key: "category", path: "category" },
    { key: "basicinfo", path: "basicinfo" },
    { key: "intro", path: "intro" },
    { key: "ticketsSetting", path: "tickets/setting" },
  ];

  for (const step of steps) {
    if (!completionStatus[step.key as keyof PageCompletionStatus]) {
      return `/create-event/${eventId}/${step.path}`;
    }
  }

  return `/organizer/events/${eventId}`;
};

// 輔助函數：檢查活動是否可以發布
export const canPublishEvent = (): boolean => {
  const store = useCreateEventStore.getState();
  const { completionStatus } = store;

  return Object.values(completionStatus).every(Boolean);
};

// 輔助函數：獲取活動當前步驟
export const getCurrentStep = (): string => {
  const store = useCreateEventStore.getState();
  const { completionStatus } = store;

  if (!completionStatus.eventplacetype) return "eventplacetype";
  if (!completionStatus.category) return "category";
  if (!completionStatus.basicinfo) return "basicinfo";
  if (!completionStatus.intro) return "intro";
  if (!completionStatus.ticketsSetting) return "ticketsSetting";

  return "completed";
};
