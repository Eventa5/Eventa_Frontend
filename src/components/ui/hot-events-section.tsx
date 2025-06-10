"use client";

import { formatEventDate } from "@/features/activities/formatEventDate";
import { getApiV1ActivitiesPopular } from "@/services/api/client/sdk.gen";
import type { ActivitiesResponse } from "@/services/api/client/types.gen";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import { EventCard } from "./event-cards";

interface Event {
  id: string;
  title: string;
  location: string;
  date: import("./event-cards").EventCardDate;
  imageUrl: string;
}

export default function HotEventsSection() {
  const { data, error, isLoading } = useSWR("popular-activities", async () => {
    const response = await getApiV1ActivitiesPopular();
    return response.data?.data || [];
  });

  if (isLoading) {
    return <div className="w-full h-[400px] flex items-center justify-center">載入中...</div>;
  }

  if (error) {
    return <div className="w-full h-[400px] flex items-center justify-center">載入失敗</div>;
  }

  const events: Event[] = (data || []).map((activity: ActivitiesResponse) => ({
    id: String(activity.id || 0),
    title: activity.title || "",
    location: activity.location || "",
    date: formatEventDate(activity.startTime || "", activity.endTime || ""),
    imageUrl: activity.cover || "",
  }));

  return (
    <>
      {/* 手機版使用 Swiper */}
      <div className="md:hidden w-full overflow-hidden">
        <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          grabCursor={true}
          className="w-full"
        >
          {events.map((event) => (
            <SwiperSlide
              key={event.id}
              className="!w-[253px] !h-[340px] shrink-0"
            >
              <EventCard {...event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 平板與桌機版使用 Grid 佈局 */}
      <div className="hidden md:grid md:gap-6 md:justify-items-center md:grid-cols-[repeat(2,_324px)] 2xl:grid-cols-[repeat(3,_411px)]">
        {events.map((event) => (
          <EventCard
            key={event.id}
            {...event}
          />
        ))}
      </div>
    </>
  );
}
