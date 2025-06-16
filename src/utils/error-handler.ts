"use client";

import { useCreateEventStore } from "@/store/create-event";
import { useDialogStore } from "@/store/dialog";
import { useCallback } from "react";

/**
 * 全局錯誤處理函數 - 非 React 環境使用
 * 可以在任何地方使用，包括非 React 組件中
 * @param error 錯誤對象
 * @param options 錯誤處理選項
 */
export const handleGlobalError = (
  error: unknown,
  options?: {
    showDialog?: boolean;
    updateStoreError?: boolean;
    customErrorMessage?: string;
  }
) => {
  const dialogStore = useDialogStore.getState();
  const createEventStore = useCreateEventStore.getState();

  const { showDialog = true, updateStoreError = true, customErrorMessage } = options || {};

  console.error("操作失敗:", error);

  const errorMessage =
    customErrorMessage || (error instanceof Error ? error.message : "操作發生錯誤，請稍後再試");

  if (showDialog) {
    dialogStore.showError(errorMessage);
  }

  if (updateStoreError) {
    createEventStore.setError(errorMessage);
  }

  return errorMessage;
};

/**
 * 錯誤處理包裝器：用於包裝 API 請求的函數
 * @param fn 要執行的異步函數
 * @param options 錯誤處理選項
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  options?: {
    showDialog?: boolean; // 是否顯示彈窗（默認為 true）
    updateStoreError?: boolean; // 是否更新 store 中的錯誤狀態（默認為 true）
    customErrorMessage?: string; // 自定義錯誤訊息
  }
): Promise<T | null> => {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    handleGlobalError(error, options);
    return null;
  }
};

/**
 * 使用 hook 方式包裝錯誤處理
 * 在 React 組件中使用
 */
export const useErrorHandler = () => {
  const { showError } = useDialogStore();
  const { setError } = useCreateEventStore();

  const handleError = useCallback(
    (
      error: unknown,
      options?: {
        showDialog?: boolean;
        updateStoreError?: boolean;
        customErrorMessage?: string;
      }
    ) => {
      const { showDialog = true, updateStoreError = true, customErrorMessage } = options || {};

      const errorMessage =
        customErrorMessage || (error instanceof Error ? error.message : "操作發生錯誤，請稍後再試");

      if (showDialog) {
        showError(errorMessage);
      }

      if (updateStoreError) {
        setError(errorMessage);
      }

      return errorMessage;
    },
    [showError, setError]
  );

  return { handleError };
};
