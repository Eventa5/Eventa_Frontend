"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

type Category = {
  name: string;
  imageUrl: string;
};

interface CategorySwiperProps {
  categories: Category[];
}

export default function CategorySwiper({ categories }: CategorySwiperProps) {
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
            href={`/events?category=${category.name}`}
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
              <span className="text-white font-bold text-[18px] lg:text-[24px] tracking-widest">
                {category.name}
              </span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
