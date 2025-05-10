/**
 * 認證相關的常數
 */

// Token 存儲的 key 名稱 (localStorage 和 cookie 共用)
export const TOKEN_KEY = "auth_token";

// Cookie 相關設定
export const COOKIE_CONFIG = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

// Token 有效期（天數）
export const TOKEN_EXPIRES_DAYS = 7;

// 計算過期日期的輔助函數
export function getExpiryDate(days: number = TOKEN_EXPIRES_DAYS): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// 環境檢測
export const isServer = typeof window === "undefined";
export const isClient = !isServer;
