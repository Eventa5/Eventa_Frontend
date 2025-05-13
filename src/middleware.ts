import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./services/auth";

// 需要認證的路徑
const PROTECTED_PATH_REGEX = [/^\/attendee\/profile(\/|$)/, /^\/events\/[^/]+\/checkout$/];

export async function middleware(request: NextRequest) {
  // 獲取當前請求的路徑
  const { pathname } = request.nextUrl;

  // 是否需要保護此路徑
  const isProtectedPath = PROTECTED_PATH_REGEX.some((regex) => regex.test(pathname));

  if (isProtectedPath) {
    if (await isAuthenticated()) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("authRequired", "true");

    return NextResponse.redirect(redirectUrl);
  }

  // 允許請求繼續
  return NextResponse.next();
}

// 設置中間件應用的路徑
export const config = {
  matcher: ["/attendee/profile/:path*", "/events/:path*/checkout"],
};
