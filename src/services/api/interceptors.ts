import { toast } from "sonner";
import { client } from "./client/client.gen";

/**
 * 處理 API 響應，特別是認證錯誤
 */
client.interceptors.response.use(async (response) => {
  // 檢查是否為認證錯誤 (401)
  if (response.status === 401) {
    console.error("認證失敗: 無效的 token 或 token 已過期");

    // 在客戶端環境下處理認證錯誤
    if (typeof window !== "undefined") {
      // 顯示通知
      toast.error("認證已過期，請重新登入");

      // 重定向到登入頁面
      const currentPath = window.location.pathname;
      window.location.href = `/signin?redirect=${currentPath}`;
    }
  }

  return response;
});
