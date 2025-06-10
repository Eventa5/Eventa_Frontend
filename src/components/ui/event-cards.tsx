"use client";

import { Calendar, MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// 活動卡片類型
export interface EventCardDate {
  isSameDay: boolean;
  startDateString: string;
  timeString?: string;
  endDateString?: string;
}

export interface EventCardProps {
  id: string;
  title: string;
  location: string;
  date: EventCardDate;
  imageUrl: string;
  size?: "sm" | "base";
}

export const EventCard = ({
  id,
  title,
  location,
  date,
  imageUrl,
  size = "base",
}: EventCardProps) => {
  // 預設樣式與依據尺寸的樣式組合
  const styles = {
    card: {
      base: "rounded-t-[30px] w-[253px] md:w-[324px] 2xl:w-[411px] h-full",
      sm: "flex-row md:flex-col rounded-tl-[20px] rounded-bl-[20px] md:rounded-bl-none md:rounded-t-[30px] md:w-full h-full",
    },
    image: {
      base: "h-[148px] md:h-[200px] 2xl:h-[274px] w-full",
      sm: "h-[114px] w-[164px] md:h-[160px] md:w-full 2xl:h-[201px]",
    },
    content: {
      base: "",
      sm: "w-[179px] md:w-auto",
    },
    title: {
      base: "font-bold text-[18px] leading-[27px] tracking-[0.03em] text-[#262626] line-clamp-2",
      sm: "!text-[14px] !leading-5",
    },
    titleContainer: {
      base: "px-2 h-[54px] 2xl:grow",
      sm: "px-2 md:h-[54px]",
    },
  };

  const cardClassName = `flex flex-col relative overflow-hidden flex-shrink-0 group ${styles.card[size]}`;

  const imageClassName = `relative overflow-hidden ${styles.image[size]} shrink-0`;

  const contentClassName = `flex flex-col gap-2 p-4 md:p-6 bg-white grow ${styles.content[size]}`;

  return (
    <Link
      href={`/events/${id}`}
      className={cardClassName}
    >
      <div className={imageClassName}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={
              size === "sm"
                ? "(max-width: 768px) 164px, (max-width: 1280px) 50vw, 33vw"
                : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            }
            className="object-cover group-hover:scale-105 transition-transform duration-300 shrink-0"
          />
        ) : (
          <div className="bg-neutral-600 group-hover:bg-neutral-600/50 w-full h-full absolute left-0 top-0  duration-200" />
        )}
      </div>

      <div className={contentClassName}>
        {/* 地點標籤 */}
        <div
          className={`inline-flex rounded-lg py-1 px-2 w-fit ${location ? "bg-[#FDF1ED]" : "bg-primary-300"}`}
        >
          <span
            className={`${location ? "text-[#F07348]" : "text-center text-primary-900"} text-sm tracking-wider`}
          >
            {location ? location : "線上活動"}
          </span>
        </div>

        {/* 標題 */}
        <div className={styles.titleContainer[size]}>
          <h3 className={`${styles.title.base} ${size === "sm" ? styles.title.sm : ""}`}>
            {title}
          </h3>
        </div>

        <div
          className={`${size === "sm" ? "hidden md:block" : ""} border-t border-[#E5E5E5] my-1`}
        />

        <div
          className={`${size === "sm" ? "hidden md:flex" : "flex"} items-center gap-3 px-2 text-[#A3A3A3]`}
        >
          <Calendar className="w-4 h-4 shrink-0 stroke-[#A3A3A3]" />
          <span className="text-sm whitespace-pre-line">
            {date.isSameDay ? (
              <>
                {date.startDateString}
                <br />
                {date.timeString}
              </>
            ) : (
              <>
                {date.startDateString}
                <br />
                {date.endDateString}
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

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
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={628}
                  height={450}
                  className="rounded-[30px] object-cover w-full aspect-[16/9] shadow-sm"
                />
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

// 服務卡片
interface ServiceCardProps {
  title: JSX.Element;
  description: string[];
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  linkUrl: string;
}

export const ServiceCard = ({
  title,
  description,
  imageUrl,
  imageAlt,
  buttonText,
  linkUrl,
}: ServiceCardProps) => {
  return (
    <div className="flex flex-col-reverse items-center justify-start  2xl:flex-row bg-white rounded-[30px] rounded-tl-[160px] overflow-hidden shadow-md px-8 md:px-[45px] w-[343px] h-[405px]  2xl:w-auto  2xl:h-[374px]">
      <div className="pr-4 relative shrink-0 flex items-center justify-center w-[144px] h-[144px]  2xl:w-[200px]  2xl:h-[200px]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={200}
          height={200}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col shrink-0  2xl:w-[322px]">
        <div className="space-y-4 flex flex-col items-center  2xl:items-start w-[276px]  2xl:w-full">
          <h3 className="font-bold text-center whitespace-nowrap  2xl:text-start text-[24px]  2xl:text-[30px] text-black leading-tight font-serif-tc">
            {title}
          </h3>
          <div className="text-center  2xl:text-start">
            {description.map((item, i) => (
              <p
                key={`desc-${item}`}
                className="text-[#2E2E2E] text-[12px]  2xl:text-[14px] whitespace-nowrap"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <Link
          href={linkUrl}
          className="mt-6 inline-flex items-center gap-2 bg-[#F07348] text-white px-6 py-3 rounded-xl font-bold  2xl:self-start"
        >
          <span className="ml-2">→</span>
          {buttonText}
        </Link>
      </div>
    </div>
  );
};
