/**
 * 伺服器端 Cookie 管理服務
 * 負責在 API 路由中設置和清除 cookies
 */

import type { NextResponse } from "next/server";
import { COOKIE_CONFIG, TOKEN_KEY, getExpiryDate } from "./authConstants";

/**
 * 在 API 路由中設置認證 token cookie
 */
export function setAuthCookie(
  response: NextResponse,
  token: string,
  expiresInDays = 7
): NextResponse {
  response.cookies.set({
    name: TOKEN_KEY,
    value: token,
    expires: getExpiryDate(expiresInDays),
    ...COOKIE_CONFIG,
  });

  return response;
}

/**
 * 在 API 路由中刪除認證 token cookie
 */
export function removeAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: TOKEN_KEY,
    value: "",
    expires: new Date(0),
    ...COOKIE_CONFIG,
  });

  return response;
}
