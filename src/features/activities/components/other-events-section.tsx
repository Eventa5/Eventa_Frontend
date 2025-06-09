"use client";
import { EventCard } from "@/components/ui/event-cards";
import { getApiV1Activities } from "@/services/api/client/sdk.gen";
import type { ActivitiesResponse } from "@/services/api/client/types.gen";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWR from "swr";

const fetcher = async (url: string): Promise<ActivitiesResponse[]> => {
  const response = await getApiV1Activities({
    query: {
      page: 1,
      limit: 8,
    },
  });
  return response.data?.data || [];
};

export default function OtherEventsSection() {
  const [page, setPage] = useState(1);
  const [allEvents, setAllEvents] = useState<ActivitiesResponse[]>([]);
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(false);
  const { ref, inView } = useInView();

  const {
    data: events,
    error,
    isLoading,
    mutate,
  } = useSWR<ActivitiesResponse[]>(
    `/api/v1/activities?page=${page}`,
    async () => {
      const response = await getApiV1Activities({
        query: {
          page,
          limit: 8,
        },
      });
      return response.data?.data || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (events) {
      setAllEvents((prev) => [...prev, ...events]);
    }
  }, [events]);

  useEffect(() => {
    if (inView && isInfiniteScrollEnabled && events && events.length > 0) {
      setPage((prev) => prev + 1);
    }
  }, [inView, events, isInfiniteScrollEnabled]);

  const handleLoadMore = () => {
    setIsInfiniteScrollEnabled(true);
    setPage((prev) => prev + 1);
  };

  if (isLoading && page === 1) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>載入失敗，請稍後再試</div>;
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
          {allEvents.map((event) => (
            <EventCard
              key={event.id}
              id={String(event.id)}
              title={event.title || ""}
              location={event.location || ""}
              date={`${event.startTime || ""} - ${event.endTime || ""}`}
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
              {isLoading && <div>載入更多活動中...</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
