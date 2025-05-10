import { setAuthCookie } from "@/services/serverCookies";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "缺少 token 參數" }, { status: 400 });
    }

    // 創建響應
    const response = NextResponse.json(
      { success: true, message: "Cookie 設置成功" },
      { status: 200 }
    );

    // 使用 serverCookies 服務設置 cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("設置 cookie 失敗:", error);
    return NextResponse.json({ success: false, message: "設置 cookie 失敗" }, { status: 500 });
  }
}
