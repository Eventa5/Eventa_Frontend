/**
 * 伺服器端認證服務
 * 負責處理伺服器端的 token 獲取和管理
 */

import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { TOKEN_KEY } from "./authConstants";

// 避免直接導入 next/headers，它只能在 App Router 的服務器組件中使用
let appRouterCookies: () => Promise<ReadonlyRequestCookies>;

/**
 * 只在需要時動態導入 next/headers
 */
async function getAppRouterCookies() {
  if (!appRouterCookies) {
    try {
      const { cookies } = await import("next/headers");
      appRouterCookies = cookies;
    } catch (error) {
      console.error("Failed to import next/headers:", error);
      return null;
    }
  }
  return appRouterCookies;
}

/**
 * 從伺服器端獲取 auth token
 */
export async function getServerAuthToken(): Promise<string> {
  try {
    const cookiesFunc = await getAppRouterCookies();
    if (cookiesFunc) {
      const cookieStore = await cookiesFunc();
      const authCookie = cookieStore.get(TOKEN_KEY);
      return authCookie?.value || "";
    }
  } catch (error) {
    console.error("獲取 cookie 失敗:", error);
  }

  return "";
}
