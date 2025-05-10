import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./services/auth";

// 需要認證的路徑
const PROTECTED_PATHS = ["/attendee/profile"];

export async function middleware(request: NextRequest) {
  // 獲取當前請求的路徑
  const { pathname } = request.nextUrl;

  // 是否需要保護此路徑
  const isProtectedPath = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath) {
    if (await isAuthenticated()) {
      return NextResponse.next();
    }
    console.log("redirect to signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 允許請求繼續
  return NextResponse.next();
}

// 設置中間件應用的路徑
export const config = {
  matcher: ["/attendee/profile/:path*"],
};
