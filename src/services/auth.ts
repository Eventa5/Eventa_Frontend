/**
 * 統一認證服務
 * 提供跨環境的認證 API，整合客戶端和伺服器端認證
 */

import { isServer } from "./authConstants";
import {
  clearCookieViaApi,
  getLocalStorageToken,
  removeLocalStorageToken,
  setCookieViaApi,
  setLocalStorageToken,
} from "./clientAuth";
import { getServerAuthToken } from "./serverAuth";

/**
 * 設置認證 Token
 * - 客戶端：設置 localStorage 和 HttpOnly Cookie
 * - 伺服器端：不支援 (返回 false)
 */
export async function setAuthToken(token: string): Promise<boolean> {
  if (isServer) return false;

  try {
    // 1. 保存至 localStorage
    setLocalStorageToken(token);

    // 2. 設置 HttpOnly Cookie
    const cookieSet = await setCookieViaApi(token);

    return cookieSet;
  } catch (error) {
    console.error("設置認證 token 失敗:", error);
    return false;
  }
}

/**
 * 獲取認證 Token
 * - 伺服器端：從 cookie 獲取
 * - 客戶端：從 localStorage 獲取
 */
export async function getAuthToken(): Promise<string> {
  if (isServer) {
    // 在伺服器端，使用 serverAuth 中的方法從 cookie 獲取
    return await getServerAuthToken();
  }
  // 在客戶端，從 localStorage 獲取
  return getLocalStorageToken();
}

/**
 * 刪除認證 Token
 * - 客戶端：刪除 localStorage 和 HttpOnly Cookie
 * - 伺服器端：不支援 (返回 false)
 */
export async function removeAuthToken(): Promise<boolean> {
  if (isServer) return false;

  try {
    // 1. 從 localStorage 刪除
    removeLocalStorageToken();

    // 2. 調用登出 API 刪除 cookie
    const cookieRemoved = await clearCookieViaApi();

    return cookieRemoved;
  } catch (error) {
    console.error("刪除認證 token 失敗:", error);
    return false;
  }
}

/**
 * 檢查使用者是否已經認證
 */
export async function isAuthenticated(): Promise<boolean> {
  return !!(await getAuthToken());
}
