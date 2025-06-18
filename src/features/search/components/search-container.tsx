"use client";

import CategoriesProvider from "@/features/activities/categories-provider";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useCategoriesStore } from "@/store/categories";
import { useSearchStore } from "@/store/search";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import MobileSearchOverlay from "./mobile-search-overlay";
import SearchButton from "./search-button";
import SearchInput from "./search-input";
import SearchOverlay from "./search-overlay";

interface SearchContainerProps {
  showBorder?: boolean;
}

export default function SearchContainer({ showBorder = false }: SearchContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useSearchStore((s) => s.setIsSearchOpen);
  const isMobile = useIsMobile();
  const { categories } = useCategoriesStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 判斷是否在 events 頁面且有 categoryId 參數
  const isEventsPage = pathname === "/events";
  const hasCategoryId = searchParams.get("categoryId");
  const showCategoryTitle = isEventsPage && hasCategoryId;

  // 處理點擊外部區域關閉搜尋區塊
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMobile &&
        isSearchOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSearchOpen, setIsSearchOpen]);

  return (
    <CategoriesProvider>
      <div
        className="relative w-full"
        ref={containerRef}
      >
        {showCategoryTitle && (
          <div className="text-xl md:text-2xl text-center font-bold font-serif-tc mb-4 lg:mb-6 text-neutral-700">
            {`類別：${categories.find((category) => category.id === Number(hasCategoryId))?.name}`}
          </div>
        )}
        {!isMobile && <SearchInput showBorder={showBorder} />}
        {isMobile && <SearchButton showBorder={showBorder} />}
        <SearchOverlay />
        <MobileSearchOverlay />
      </div>
    </CategoriesProvider>
  );
}
