import { removeAuthCookie } from "@/services/serverCookies";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 創建響應
    const response = NextResponse.json(
      { success: true, message: "Cookie 清除成功" },
      { status: 200 }
    );

    // 使用 serverCookies 服務清除 cookie
    removeAuthCookie(response);

    return response;
  } catch (error) {
    console.error("登出失敗:", error);
    return NextResponse.json({ success: false, message: "登出失敗" }, { status: 500 });
  }
}
