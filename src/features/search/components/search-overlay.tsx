"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useCategoriesStore } from "@/store/categories";
import { useSearchStore } from "@/store/search";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { POPULAR_SEARCHES } from "../constants/search";
import "swiper/css";

export default function SearchOverlay() {
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const toggleSearch = useSearchStore((s) => s.toggleSearch);
  const setSearchValue = useSearchStore((s) => s.setSearchValue);
  const { categories } = useCategoriesStore();
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useIsMobile();

  // 控制顯示狀態，增加過渡動畫效果
  useEffect(() => {
    if (isSearchOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200); // 等待過渡動畫結束
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // 選擇熱門搜尋
  const handlePopularSearch = (term: string) => {
    setSearchValue(term);
    toggleSearch();
    router.push(`/events?search=${encodeURIComponent(term)}`);
  };

  // 選擇分類
  const handleCategorySearch = (categoryId: string) => {
    toggleSearch();
    router.push(`/events?categoryId=${encodeURIComponent(categoryId)}`);
  };

  // 如果是手機版或搜尋未開啟且不可見，則不渲染
  if (isMobile || (!isSearchOpen && !isVisible)) return null;

  return (
    <div
      ref={overlayRef}
      className={`absolute top-[calc(100%+8px)] left-0 z-50 w-full bg-white rounded-xl shadow-md p-8 flex flex-col gap-8 transition-all duration-200 ease-in-out ${
        isSearchOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {/* 關閉按鈕 */}
      <Button
        variant="ghost"
        onClick={toggleSearch}
        className="absolute top-4 right-4 p-1"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* 熱門搜尋 */}
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-[#262626]">熱門搜尋</h3>
        <div className="flex flex-wrap gap-4">
          {POPULAR_SEARCHES.map((item) => (
            <button
              type="button"
              key={item.term}
              onClick={() => handlePopularSearch(item.term)}
              className={`${item.bgColor} px-3 py-1 rounded-full text-sm ${
                item.hoverColor || ""
              } transition-colors`}
            >
              {item.term}
            </button>
          ))}
        </div>
      </div>

      {/* 分類搜尋 */}
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-[#262626]">想找哪一類的活動 ?</h3>
        <Swiper
          spaceBetween={16}
          slidesPerView="auto"
          className="w-full"
        >
          {categories.map((category) => (
            <SwiperSlide
              key={category.name}
              className="!w-auto"
            >
              <div
                className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleCategorySearch(category.id?.toString() ?? "")}
              >
                <div
                  className="w-[80px] h-[80px] bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url('${category.imageUrl}')` }}
                />
                <span className="text-sm">{category.name}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
