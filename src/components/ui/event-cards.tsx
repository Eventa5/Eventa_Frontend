"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
                {date.startDateString} -
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
