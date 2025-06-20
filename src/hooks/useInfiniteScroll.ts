import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  isInfiniteScrollEnabled: boolean;
  page: number;
  fetchData: (page: number) => Promise<void>;
  enableInfiniteScroll: () => void;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  isInfiniteScrollEnabled,
  page,
  fetchData,
  enableInfiniteScroll,
}: UseInfiniteScrollProps) {
  const { ref, inView } = useInView();
  const isLoadingSecondPage = useRef(false);

  // 處理無限滾動
  useEffect(() => {
    if (
      inView &&
      hasMore &&
      !isLoading &&
      isInfiniteScrollEnabled &&
      !isLoadingSecondPage.current
    ) {
      fetchData(page + 1);
    }
  }, [inView, hasMore, isLoading, page, fetchData, isInfiniteScrollEnabled]);

  const handleLoadMore = useCallback(() => {
    if (!isInfiniteScrollEnabled) {
      isLoadingSecondPage.current = true;
      // 立即載入第二頁
      fetchData(2).then(() => {
        // 等待第二頁載入完成後，再啟用無限滾動
        setTimeout(() => {
          enableInfiniteScroll();
          isLoadingSecondPage.current = false;
        }, 100);
      });
    }
  }, [fetchData, isInfiniteScrollEnabled, enableInfiniteScroll]);

  return {
    ref,
    handleLoadMore,
  };
}
