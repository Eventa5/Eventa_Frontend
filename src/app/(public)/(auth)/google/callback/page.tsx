"use client";

import { useEffect } from "react";

export default function GoogleCallback() {
  useEffect(() => {
    // 取得 token
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    // 將 token 傳回 opener
    if (token && window.opener) {
      window.opener.postMessage({ type: "google-callback", token }, window.opener.origin || "*");
    }

    // 關閉自己
    window.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>正在處理登入，請稍候...</p>
    </div>
  );
}
