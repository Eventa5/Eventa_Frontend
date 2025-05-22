"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export default function ActionResultPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSuccess = searchParams.get("success") === "1";
  const isSplit = pathname.includes("/split/");

  const title = isSplit ? "分票結果" : "退票結果";
  const message = isSuccess
    ? isSplit
      ? "分票成功！"
      : "退票成功！"
    : isSplit
      ? "分票失敗，請稍後再試。"
      : "退票失敗，請稍後再試。";
  const color = isSuccess ? "text-green-600" : "text-red-600";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className={`border rounded p-6 mb-4 text-center ${color} text-xl font-semibold`}>
        {message}
      </div>
    </div>
  );
}
