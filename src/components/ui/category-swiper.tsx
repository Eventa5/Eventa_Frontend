"use client";

import { useCategoriesStore } from "@/store/categories";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

export default function CategorySwiper() {
  const { categories, error, isLoading } = useCategoriesStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[219px] md:h-[310px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[219px] md:h-[310px] gap-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={24}
      slidesPerView="auto"
      grabCursor={true}
      loop={false}
      className="max-w-full"
    >
      {categories.map((category) => (
        <SwiperSlide
          key={category.name}
          className="!h-[219px] md:!h-[310px] xl:first:!w-[411px] !w-[136px] md:!w-[193px] shrink-0"
        >
          <Link
            href={`/events?categoryId=${category?.id}`}
            className={"relative h-full w-full rounded-[30px] overflow-hidden group block"}
          >
            <Image
              src={category.imageUrl}
              alt={category.name}
              width={930}
              height={622}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute left-4 bottom-4 lg:left-6 lg:bottom-6 flex items-center justify-center">
              <div className="px-4 py-2 rounded-lg backdrop-blur-xs bg-neutral-500/20">
                <span className="text-white font-bold text-[18px] lg:text-[24px] tracking-widest">
                  {category.name}
                </span>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
