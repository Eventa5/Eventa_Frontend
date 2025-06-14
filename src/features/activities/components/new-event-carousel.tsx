"use client";

import type { EventCardProps } from "@/components/ui/event-cards";
import { getApiV1ActivitiesPopular } from "@/services/api/client/sdk.gen";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import { formatEventDate } from "../formatEventDate";

export const EventCarousel = ({ events }: { events: EventCardProps[] }) => {
  return (
    <div className="relative w-full">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 100,
          },
          640: {
            slidesPerView: 1.3,
            spaceBetween: -200,
          },
          1024: {
            slidesPerView: 2.2,
            spaceBetween: -314,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: -314,
          },
        }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            swiper.update();
          }, 100); // 或更久，看情況
        }}
        loop={true}
        navigation={{
          enabled: true,
          nextEl: ".event-swiper-next",
          prevEl: ".event-swiper-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        coverflowEffect={{
          rotate: 5,
          stretch: 0,
          depth: 150,
          modifier: 5,
          slideShadows: false,
        }}
        modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <div className="py-4 px-2 md:py-6 md:px-4">
              <Link href={`/events/${event.id}`}>
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={628}
                    height={450}
                    className="rounded-[30px] object-cover w-full aspect-[16/9] shadow-sm"
                  />
                ) : (
                  <div className="rounded-[30px] object-cover w-full aspect-[16/9] shadow-sm bg-neutral-600" />
                )}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-pagination mt-8" />

      <button
        type="button"
        className="event-swiper-prev absolute left-2 md:left-6 top-1/2 z-10 -translate-y-1/2 bg-[#FDFBF5] w-[40px] h-[40px] md:w-[48px] md:h-[48px] border-2 border-[#262626] rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      >
        <MoveLeft className="w-4 h-4 md:w-5 md:h-5 stroke-[#262626]" />
      </button>
      <button
        type="button"
        className="event-swiper-next absolute right-2 md:right-6 top-1/2 z-10 -translate-y-1/2 bg-[#FDFBF5] w-[40px] h-[40px] md:w-[48px] md:h-[48px] border-2 border-[#262626] rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      >
        <MoveRight className="w-4 h-4 md:w-5 md:h-5 stroke-[#262626]" />
      </button>
    </div>
  );
};

export function NewEventCarousel() {
  const { data, isLoading, error } = useSWR(
    "popular-events",
    async () => {
      const response = await getApiV1ActivitiesPopular({ query: { recent: "1" } });
      return response.data?.data || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1分鐘內不會重複請求
    }
  );

  if (isLoading) return <div className="text-center text-2xl font-bold">載入中...</div>;
  if (error) return <div className="text-center text-2xl font-bold">載入失敗</div>;
  if (!data || data.length === 0)
    return <div className="text-center text-2xl font-bold">暫無資料</div>;

  const events = data.map((item) => ({
    id: String(item.id),
    title: item.title || "",
    location: item.location || "",
    date: formatEventDate(item.startTime || "", item.endTime || ""),
    imageUrl: item.cover || "",
  }));

  return <EventCarousel events={events} />;
}
