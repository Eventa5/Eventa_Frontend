"use client";

import { EventCard } from "@/components/ui/event-cards";
import HotEventsSection from "@/components/ui/hot-events-section";
import { NewEventCarousel } from "@/features/activities/components/new-event-carousel";
import OtherEventsSection from "@/features/activities/components/other-events-section";
import { formatEventDate } from "@/features/activities/formatEventDate";
import SearchContainer from "@/features/search/components/search-container";
import { useActivitiesStore } from "@/store/activities";
import { useSearchStore } from "@/store/search";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";

function EventsPageContent() {
  const { activities, fetchOtherActivities, isLoading } = useActivitiesStore();
  const searchValue = useSearchStore((s) => s.searchValue);
  const setSearchValue = useSearchStore((s) => s.setSearchValue);
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  // Debounced 搜尋函數
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (categoryId?: string, keyword?: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (categoryId || keyword) {
            fetchOtherActivities(1, Number(categoryId), keyword);
          }
        }, 500);
      };
    })(),
    [fetchOtherActivities]
  );

  // 頁面離開時清空搜尋狀態
  useEffect(() => {
    return () => {
      setSearchValue("");
      hasInitialized.current = false;
    };
  }, [setSearchValue]);

  // 從 URL 參數中讀取搜尋值和分類（只在初始載入時同步一次）
  useEffect(() => {
    const urlSearchValue = searchParams.get("search");
    const urlCategoryId = searchParams.get("categoryId");

    // 只在初始載入時同步 URL 參數到 store
    if (!hasInitialized.current && urlSearchValue) {
      setSearchValue(urlSearchValue);
      hasInitialized.current = true;
    }
    debouncedSearch(urlCategoryId || undefined, urlSearchValue || undefined);
  }, [searchParams, setSearchValue, debouncedSearch]);

  // 當 store 中的搜尋值改變時，也要觸發搜尋
  useEffect(() => {
    if (searchValue?.trim() && !searchParams.get("search")) {
      // 如果 store 有搜尋值但 URL 沒有，執行 debounced 搜尋
      debouncedSearch(undefined, searchValue);
    }
  }, [searchValue, searchParams, debouncedSearch]);

  // 判斷是否為搜尋模式
  const isSearchMode =
    searchValue?.trim() || searchParams.get("search") || searchParams.get("categoryId");

  return (
    <main className="flex flex-col w-full min-h-screen bg-primary-50 pt-10 -mt-10">
      {/* 搜尋容器 */}
      <section className="flex justify-center">
        <div className="w-full max-w-[900px] px-8 pt-16">
          <SearchContainer showBorder />
        </div>
      </section>
      {/* 其他活動（搜尋時搬到最上面） */}
      {isSearchMode && (
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="flex flex-col items-center">
            {isLoading ? (
              <div className="text-gray-400 text-xl py-24">搜尋中...</div>
            ) : activities.length > 0 ? (
              <>
                <div className="flex flex-col items-center mb-12">
                  <div className="flex items-end gap-6 mb-6 font-serif-tc">
                    <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">搜尋</h2>
                    <Image
                      src="/images/balloon-red.png"
                      width={50}
                      height={100}
                      className="w-6 h-12 md:w-10 md:h-20"
                      alt="氣球"
                    />
                    <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">結果</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[repeat(2,_302px)] lg:grid-cols-[repeat(3,_302px)] 2xl:grid-cols-[repeat(4,_302px)] gap-6 justify-items-center mx-auto">
                  {activities.map((event) => (
                    <EventCard
                      key={event.id}
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
                  <Link
                    href="/events"
                    className="px-8 py-3 border border-[#525252] rounded-xl text-[#525252] hover:bg-[#F5F5F5] transition-colors"
                  >
                    查看更多
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-xl py-24">
                找不到符合「
                {searchValue || searchParams.get("search")}
                」的活動
              </div>
            )}
          </div>
        </section>
      )}
      {/* 最新強檔（搜尋時隱藏） */}
      {!isSearchMode && (
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center mb-3 md:mb-8">
              <div className="flex items-center gap-6 mb-6 font-serif-tc">
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">最新強檔</h2>
                <Image
                  src="/images/balloon.png"
                  width={50}
                  height={100}
                  className="w-6 h-12 md:w-10 md:h-20"
                  alt="氣球"
                />
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">話題不斷</h2>
              </div>
              <p className="text-[14px] md:text-[18px] text-[#525252] text-center max-w-3xl">
                不只是活動，更是讓生活亮起來的機會，錯過這波話題活動，就真的只能看別人打卡了！
              </p>
            </div>
            <NewEventCarousel />
          </div>
        </section>
      )}
      {/* 熱門活動 */}
      <section className="pt-[116px] pb-[116px] md:pt-[200px] md:pb-[173px] px-4 md:px-8 bg-hot-activity">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 md:mb-[64px]">
            <div className="flex items-center gap-6 mb-6 font-serif-tc">
              <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">熱門</h2>
              <Image
                src="/images/balloon-red.png"
                width={50}
                height={100}
                className="w-6 h-12 md:w-10 md:h-20"
                alt="氣球"
              />
              <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">活動</h2>
            </div>
            <p className="text-[14px] md:text-[18px] text-[#525252] text-center max-w-3xl">
              大家最近都在參加<span className="hidden md:inline-block">、</span>
              <br className="md:hidden" />
              討論度最高的熱門活動都在這裡！
            </p>
          </div>
          <HotEventsSection />
        </div>
      </section>
      {/* 其他活動（搜尋時以外才顯示） */}
      {!isSearchMode && <OtherEventsSection />}
    </main>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary-50 -mt-10">
          載入中...
        </div>
      }
    >
      <EventsPageContent />
    </Suspense>
  );
}
