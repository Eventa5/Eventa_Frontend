import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { client } from "./client/client.gen";

/**
 * 處理 API 響應，特別是認證錯誤
 */
client.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    // 在客戶端環境下處理認證錯誤
    if (typeof window !== "undefined") {
      // 顯示通知
      toast.error("認證已過期，請重新登入");
      // 清除當前的認證狀態
      await useAuthStore.getState().logout();
      // 重定向到登入頁面
      window.location.href = "/?authRequired=1";
    }
  }

  return response;
});
