"use client";
import { EventCard } from "@/components/ui/event-cards";
import { formatEventDate } from "@/features/activities/formatEventDate";
import { useActivitiesStore } from "@/store/activities";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function OtherEventsSection() {
  const { ref, inView } = useInView();
  const isLoadingSecondPage = useRef(false);
  const isMounted = useRef(false);
  const {
    activities,
    isLoading,
    error,
    page,
    hasMore,
    isFirstPageLoaded,
    isInfiniteScrollEnabled,
    fetchOtherActivities,
    resetOtherActivities,
    enableInfiniteScroll,
  } = useActivitiesStore();

  // 只在組件首次掛載時載入第一頁
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchOtherActivities(1);
    }
    return () => {
      resetOtherActivities();
      isMounted.current = false;
    };
  }, [fetchOtherActivities, resetOtherActivities]);

  // 處理無限滾動
  useEffect(() => {
    if (
      inView &&
      hasMore &&
      !isLoading &&
      isInfiniteScrollEnabled &&
      !isLoadingSecondPage.current
    ) {
      fetchOtherActivities(page + 1);
    }
  }, [inView, hasMore, isLoading, page, fetchOtherActivities, isInfiniteScrollEnabled]);

  const handleLoadMore = useCallback(() => {
    if (!isInfiniteScrollEnabled) {
      isLoadingSecondPage.current = true;
      // 立即載入第二頁
      fetchOtherActivities(2).then(() => {
        // 等待第二頁載入完成後，再啟用無限滾動
        setTimeout(() => {
          enableInfiniteScroll();
          isLoadingSecondPage.current = false;
        }, 100);
      });
    }
  }, [fetchOtherActivities, isInfiniteScrollEnabled, enableInfiniteScroll]);

  if (isLoading && !isFirstPageLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-2xl font-bold text-[#262626]">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-xl text-red-500">載入失敗，請稍後再試</div>
      </div>
    );
  }

  return (
    <section className="py-20 md:py-32 px-4 md:px-8">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-end gap-6 mb-6 font-serif-tc">
            <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">其他</h2>
            <Image
              src="/images/balloon-red.png"
              width={50}
              height={100}
              className="w-6 h-12 md:w-10 md:h-20"
              alt="氣球"
            />
            <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">活動</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(2,_302px)] lg:grid-cols-[repeat(3,_302px)] 2xl:grid-cols-[repeat(4,_302px)] gap-6 justify-items-center">
          {activities.map((event) => (
            <EventCard
              key={`event-${event.id}-${event.startTime}`}
              id={String(event.id)}
              title={event.title || ""}
              location={event.location || ""}
              date={formatEventDate(event.startTime || "", event.endTime || "")}
              imageUrl={event.cover || ""}
              size="sm"
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          {!isInfiniteScrollEnabled ? (
            <button
              type="button"
              onClick={handleLoadMore}
              className="px-8 py-3 border border-[#525252] rounded-xl text-[#525252] hover:bg-[#F5F5F5] transition-colors"
            >
              查看更多
            </button>
          ) : (
            <div
              ref={ref}
              className="h-10"
            >
              {isLoading && <div className="text-[#525252]">載入更多活動中...</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
