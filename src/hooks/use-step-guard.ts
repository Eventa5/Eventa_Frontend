"use client";

import { canAccessStep, getNextIncompleteStep } from "@/store/create-event";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 步驟保護 Hook
 * 用於在創建活動流程中檢查步驟訪問權限
 * 如果用戶嘗試跳過步驟，將自動重定向到正確的步驟
 */
export const useStepGuard = (currentStepPath: string, eventId: string) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const numericEventId = Number.parseInt(eventId);

      // 檢查 eventId 是否有效
      if (Number.isNaN(numericEventId)) {
        router.push("/create-event/organizer");
        return;
      }

      // 檢查是否可以訪問當前步驟
      if (!canAccessStep(currentStepPath)) {
        // 如果不能訪問，重定向到下一個未完成的步驟
        const nextStep = getNextIncompleteStep(numericEventId);
        router.push(nextStep);
      }
    }, 100); // 短延遲確保 store 已經初始化

    return () => clearTimeout(timer);
  }, [currentStepPath, eventId, router]);
};
