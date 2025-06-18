"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useCategoriesStore } from "@/store/categories";
import { useSearchStore } from "@/store/search";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { POPULAR_SEARCHES } from "../constants/search";
import "swiper/css";
import "swiper/css/free-mode";

export default function MobileSearchOverlay() {
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const toggleSearch = useSearchStore((s) => s.toggleSearch);
  const searchValue = useSearchStore((s) => s.searchValue);
  const setSearchValue = useSearchStore((s) => s.setSearchValue);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const { categories, isLoading, error } = useCategoriesStore();

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

  // 處理搜尋
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    // 關閉搜尋並導航到搜尋結果頁面
    toggleSearch();
    router.push(`/events?search=${encodeURIComponent(searchValue.trim())}`);
  };

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

  if (!isMobile || (!isSearchOpen && !isVisible)) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-[9998] backdrop-blur-sm transition-opacity duration-200 ${
          isSearchOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={toggleSearch}
      />
      <div
        className={`fixed top-0 inset-0 bg-white z-[9999] flex flex-col transition-all duration-200 ease-in-out ${
          isSearchOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* 頂部導航 */}
        <div className="w-full px-4 py-2 h-[56px] flex justify-between items-center relative">
          <Button
            variant="ghost"
            onClick={toggleSearch}
            className="p-2 flex items-center cursor-pointer"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="rounded-full bg-white p-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-10">
            <Image
              src="/eventa-logo.svg"
              alt="Eventa Logo"
              width={56}
              height={56}
            />
          </div>
          <div className="w-8" />
        </div>

        {/* 搜尋標題 */}
        <div className="flex items-center bg-[#262626] text-white py-4 px-4">
          <h2 className="font-bold">搜尋活動</h2>
        </div>

        {/* 搜尋內容 */}
        <div className="flex-1 flex flex-col p-4 gap-8 overflow-y-auto">
          {/* 搜尋框 */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center border border-[#D4D4D4] rounded-xl p-2"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="輸入關鍵字搜尋..."
              className="flex-1 outline-none text-[#525252] text-sm"
              autoFocus
            />
            <Button
              type="submit"
              className="p-2 bg-transparent border-none cursor-pointer"
            >
              <Search
                size={20}
                className="text-[#525252]"
              />
            </Button>
          </form>

          {/* 熱門搜尋 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#262626]">熱門搜尋</h3>
            <div className="flex flex-wrap gap-3">
              {POPULAR_SEARCHES.map((item) => (
                <button
                  type="button"
                  key={item.term}
                  onClick={() => handlePopularSearch(item.term)}
                  className={`${item.bgColor} px-3 py-1 rounded-full text-sm`}
                >
                  {item.term}
                </button>
              ))}
            </div>
          </div>

          {/* 分類搜尋 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[#262626]">想找哪一類的活動 ?</h3>
            {isLoading ? (
              <div className="w-full text-center text-gray-500">載入中...</div>
            ) : error ? (
              <div className="w-full text-center text-red-500">{error}</div>
            ) : (
              <Swiper
                slidesPerView="auto"
                spaceBetween={16}
                freeMode={true}
                modules={[FreeMode]}
                className="w-full"
              >
                {categories.map((category) => (
                  <SwiperSlide
                    key={category.name}
                    className="!w-auto"
                    onClick={() => handleCategorySearch(category.id.toString())}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-[80px] h-[80px] bg-cover bg-center rounded-xl"
                        style={{ backgroundImage: `url('${category.imageUrl}')` }}
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
