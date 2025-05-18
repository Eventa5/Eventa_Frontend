"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EventCard } from "./EventCards";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
}

interface HotEventsSectionProps {
  events: Event[];
}

export default function HotEventsSection({ events }: HotEventsSectionProps) {
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
              className="!w-[253px] shrink-0"
            >
              <EventCard {...event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 平板與桌機版使用 Grid 佈局 */}
      <div className="hidden md:grid md:gap-6 md:justify-items-center md:grid-cols-[repeat(2,_324px)] xl:grid-cols-[repeat(3,_411px)]">
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
