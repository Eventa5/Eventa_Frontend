"use client";

import { useEffect, useState } from "react";

/**
 * 自定義 hook 用於處理媒體查詢
 * @param query 媒體查詢字符串，例如 "(min-width: 768px)"
 * @returns 布爾值，表示當前視窗是否匹配查詢條件
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 初始化時檢查是否支援 matchMedia
    const media = window.matchMedia(query);

    // 設置初始狀態
    setMatches(media.matches);

    // 定義事件監聽器函數
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 添加事件監聽器
    media.addEventListener("change", listener);

    // 清理函數
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

/**
 * 檢查是否為行動裝置視窗大小 (寬度小於 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * 檢查是否為平板及以上視窗大小 (寬度大於等於 768px)
 */
export function useIsTabletAndAbove(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/**
 * 檢查是否為桌面視窗大小 (寬度大於等於 1024px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
