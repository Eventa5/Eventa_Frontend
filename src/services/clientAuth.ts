/**
 * 客戶端認證服務
 * 負責處理本地存儲和 API 調用來管理認證 token
 */

import { TOKEN_KEY, isServer } from "./authConstants";

/**
 * 將 token 保存至 localStorage
 */
export const setLocalStorageToken = (token: string): void => {
  if (isServer) return;
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 從 localStorage 獲取 token
 */
export const getLocalStorageToken = (): string => {
  if (isServer) return "";
  return localStorage.getItem(TOKEN_KEY) || "";
};

/**
 * 從 localStorage 刪除 token
 */
export const removeLocalStorageToken = (): void => {
  if (isServer) return;
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 設置 token 到 HttpOnly cookie (透過 API)
 */
export const setCookieViaApi = async (token: string): Promise<boolean> => {
  if (isServer) return false;

  try {
    const response = await fetch("/api/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("設置 cookie 失敗:", error);
    return false;
  }
};

/**
 * 清除 HttpOnly cookie (透過 API)
 */
export const clearCookieViaApi = async (): Promise<boolean> => {
  if (isServer) return false;

  try {
    const response = await fetch("/api/clean-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("清除 cookie 失敗:", error);
    return false;
  }
};
