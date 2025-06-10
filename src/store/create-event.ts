import {
  getApiV1ActivitiesByActivityId,
  getApiV1OrganizationsByOrganizationId,
  postApiV1Activities,
} from "@/services/api/client/sdk.gen";
import type { ActivityResponse } from "@/services/api/client/types.gen";
import { create } from "zustand";
import { persist } from "zustand/middleware";

enum ActivityStep {
  activityType = "activityType", // 活動形式
  categories = "categories", // 分類
  basic = "basic", // 基本資訊
  content = "content", // 內容介紹
  ticketTypes = "ticketTypes", // 票券設定
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

  // 工具方法
  getOverallProgress: () => number;
  getStepOneProgress: () => boolean;
  getStepTwoProgress: () => boolean;

  // 重置狀態
  clearAllData: () => void;

  // 完成活動創建（在票券設定頁面調用）
  completeEventCreation: () => void;
  // 錯誤處理
  setError: (error: string | null) => void;
  clearError: () => void;

  // 步驟檢測功能
  checkStepAccess: (currentStepPath: string) => {
    canAccess: boolean;
    redirectTo: string;
  };
}

const initialState = {
  currentEventId: null,
  organizationInfo: null,
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

            // 設定活動 ID
            set({
              currentEventId: eventId,
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
        const { currentEventId, organizationInfo } = get();

        if (!currentEventId) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await getApiV1ActivitiesByActivityId({
            path: { activityId: currentEventId },
          });

          if (response.data?.data) {
            const activityData = response.data.data;

            // 檢查是否需要更新組織資訊
            const needUpdateOrganization =
              !organizationInfo ||
              (activityData?.organizationId &&
                organizationInfo.organizationId !== activityData.organizationId);

            if (needUpdateOrganization && activityData?.organizationId) {
              try {
                // 獲取組織詳細資料
                const orgResponse = await getApiV1OrganizationsByOrganizationId({
                  path: { organizationId: activityData.organizationId },
                });

                if (orgResponse.data?.data) {
                  const organizationData = orgResponse.data.data;
                  if (organizationData?.id && organizationData?.name) {
                    set({
                      activityData,
                      organizationInfo: {
                        organizationId: organizationData.id,
                        organizationName: organizationData.name,
                      },
                      isLoading: false,
                      error: null,
                    });
                  } else {
                    throw new Error("組織資料格式錯誤");
                  }
                } else {
                  throw new Error("無法獲取組織資料");
                }
              } catch (orgError) {
                // 即使組織資料獲取失敗，仍然設定活動資料
                console.warn("獲取組織資料失敗:", orgError);
                set({
                  activityData,
                  isLoading: false,
                  error: null,
                });
              }
            } else {
              // 組織資訊一致或不需要更新
              set({
                activityData,
                isLoading: false,
                error: null,
              });
            }
          } else {
            throw new Error("無法獲取活動資料");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "載入活動資料失敗";
          set({ error: errorMessage, isLoading: false }); // 如果載入失敗，清除無效的 ID
          get().clearAllData();
        }
      },

      getOverallProgress: () => {
        const { activityData } = get();

        if (!activityData?.currentStep) {
          return 0;
        }

        // 定義步驟順序
        const steps = [
          ActivityStep.activityType,
          ActivityStep.categories,
          ActivityStep.basic,
          ActivityStep.content,
          ActivityStep.ticketTypes,
        ];

        const currentStepIndex = steps.indexOf(activityData.currentStep as ActivityStep);

        if (currentStepIndex === -1) {
          return 0;
        }

        // 計算進度：(當前步驟索引 + 1) / 總步驟數 * 100
        return Math.round(((currentStepIndex + 1) / steps.length) * 100);
      },
      getStepOneProgress: () => {
        const { activityData } = get();

        if (!activityData?.currentStep) {
          return false;
        }

        // 步驟一包含：activityType, categories, basic, content
        const stepOneSteps = [
          ActivityStep.activityType,
          ActivityStep.categories,
          ActivityStep.basic,
          ActivityStep.content,
        ];

        const currentStepIndex = stepOneSteps.indexOf(activityData.currentStep as ActivityStep);

        // 如果當前步驟是步驟一的最後一步(content)或已經超過步驟一，則步驟一完成
        return (
          currentStepIndex === stepOneSteps.length - 1 ||
          activityData.currentStep === ActivityStep.ticketTypes
        );
      },

      getStepTwoProgress: () => {
        const { activityData } = get();

        // 步驟二只有票券設定，當到達 ticketTypes 步驟時即為完成
        return activityData?.currentStep === ActivityStep.ticketTypes;
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

      checkStepAccess: (currentStepPath: string) => {
        const { activityData } = get();
        const eventId = get().currentEventId;
        // 檢查 eventId 是否有效
        if (!eventId) {
          return { canAccess: false, redirectTo: "/create-event/organizer" };
        }

        // 如果沒有活動資料，只允許訪問第一步
        if (!activityData?.currentStep) {
          if (currentStepPath === "eventplacetype") {
            return { canAccess: true, redirectTo: "/create-event/organizer" };
          }
          return {
            canAccess: false,
            redirectTo: `/create-event/${eventId}/eventplacetype`,
          };
        }

        const stepOrder = [
          { path: "eventplacetype", activityStep: ActivityStep.activityType },
          { path: "category", activityStep: ActivityStep.categories },
          { path: "basicinfo", activityStep: ActivityStep.basic },
          { path: "intro", activityStep: ActivityStep.content },
          { path: "tickets/setting", activityStep: ActivityStep.ticketTypes },
        ];

        const currentActivityStepIndex = stepOrder.findIndex(
          (step) => step.activityStep === activityData.currentStep
        );
        const targetStepIndex = stepOrder.findIndex((step) => step.path === currentStepPath);

        // 如果找不到對應的步驟，則允許訪問（可能是其他頁面）
        if (targetStepIndex === -1) {
          return { canAccess: true, redirectTo: "/create-event/organizer" };
        }

        const canAccess = targetStepIndex <= currentActivityStepIndex + 1;

        if (!canAccess) {
          // 獲取下一個未完成的步驟路徑
          const nextStep = getNextIncompleteStep(eventId);
          return { canAccess: false, redirectTo: nextStep };
        }

        return { canAccess: true, redirectTo: "/create-event/organizer" };
      },
    }),
    {
      name: "create-event-storage",
      partialize: (state) => ({
        currentEventId: state.currentEventId,
        organizationInfo: state.organizationInfo,
      }),
    }
  )
);

// 輔助函數：檢查是否可以訪問指定步驟
export const canAccessStep = (stepPath: string): boolean => {
  const store = useCreateEventStore.getState();
  const { activityData } = store;

  // 如果沒有活動資料，只允許訪問第一步
  if (!activityData?.currentStep) {
    return stepPath === "eventplacetype";
  }

  const stepOrder = [
    { path: "eventplacetype", activityStep: ActivityStep.activityType },
    { path: "category", activityStep: ActivityStep.categories },
    { path: "basicinfo", activityStep: ActivityStep.basic },
    { path: "intro", activityStep: ActivityStep.content },
    { path: "tickets/setting", activityStep: ActivityStep.ticketTypes },
  ];
  const currentActivityStepIndex = stepOrder.findIndex(
    (step) => step.activityStep === activityData.currentStep
  );
  const targetStepIndex = stepOrder.findIndex((step) => step.path === stepPath);

  // 如果找不到對應的步驟，則允許訪問（可能是其他頁面）
  if (targetStepIndex === -1) return true;

  const canAccess = targetStepIndex <= currentActivityStepIndex + 1;

  return canAccess;
};

// 輔助函數：獲取下一個未完成的步驟路徑
export const getNextIncompleteStep = (eventId: number): string => {
  const store = useCreateEventStore.getState();
  const { activityData } = store;

  // 如果沒有活動資料，回到第一步
  if (!activityData?.currentStep) {
    return `/create-event/${eventId}/eventplacetype`;
  }

  // 定義步驟順序對應表
  const stepOrder = [
    { activityStep: ActivityStep.activityType, path: "eventplacetype" },
    { activityStep: ActivityStep.categories, path: "category" },
    { activityStep: ActivityStep.basic, path: "basicinfo" },
    { activityStep: ActivityStep.content, path: "intro" },
    { activityStep: ActivityStep.ticketTypes, path: "tickets/setting" },
  ];

  // 找到當前步驟的索引
  const currentStepIndex = stepOrder.findIndex(
    (step) => step.activityStep === activityData.currentStep
  );

  // 如果找不到當前步驟或已經是最後一步，跳轉到活動管理頁面
  if (currentStepIndex === -1 || currentStepIndex === stepOrder.length - 1) {
    return `/organizer/events/${eventId}`;
  }

  // 返回下一個步驟
  const nextStep = stepOrder[currentStepIndex + 1];
  return `/create-event/${eventId}/${nextStep.path}`;
};

// 輔助函數：檢查活動是否可以發布
export const canPublishEvent = (): boolean => {
  const store = useCreateEventStore.getState();
  const { activityData } = store;

  return activityData?.currentStep === ActivityStep.ticketTypes;
};

// 輔助函數：獲取活動當前步驟
export const getCurrentStep = (): string => {
  const store = useCreateEventStore.getState();
  const { activityData } = store;

  if (!activityData?.currentStep) {
    return ActivityStep.activityType;
  }

  return activityData.currentStep;
};

// 輔助函數：檢查特定步驟是否完成
export const isStepCompleted = (step: ActivityStep): boolean => {
  const store = useCreateEventStore.getState();
  const { activityData } = store;

  if (!activityData?.currentStep) {
    return false;
  }

  // 定義步驟順序
  const stepOrder = [
    ActivityStep.activityType,
    ActivityStep.categories,
    ActivityStep.basic,
    ActivityStep.content,
    ActivityStep.ticketTypes,
  ];

  const currentStepIndex = stepOrder.indexOf(activityData.currentStep as ActivityStep);
  const targetStepIndex = stepOrder.indexOf(step);

  // currentStep 表示已經完成到哪個步驟，所以當前完成步驟 >= 目標步驟時，目標步驟就算完成
  return currentStepIndex >= targetStepIndex;
};

// 輔助函數：檢查特定路徑對應的步驟是否完成
export const isStepCompletedByPath = (stepPath: string): boolean => {
  const stepMapping = {
    eventplacetype: ActivityStep.activityType,
    category: ActivityStep.categories,
    basicinfo: ActivityStep.basic,
    intro: ActivityStep.content,
    "tickets/setting": ActivityStep.ticketTypes,
  };

  const step = stepMapping[stepPath as keyof typeof stepMapping];
  return step ? isStepCompleted(step) : false;
};
