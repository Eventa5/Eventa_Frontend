"use client";

import CategoriesProvider from "@/features/activities/categories-provider";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useCategoriesStore } from "@/store/categories";
import { useSearchStore } from "@/store/search";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import MobileSearchOverlay from "./mobile-search-overlay";
import SearchButton from "./search-button";
import SearchInput from "./search-input";
import SearchOverlay from "./search-overlay";

interface SearchContainerProps {
  showBorder?: boolean;
}

function SearchContainerContent({ showBorder = false }: SearchContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useSearchStore((s) => s.setIsSearchOpen);
  const isMobile = useIsMobile();
  const { categories, isLoading } = useCategoriesStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 判斷是否在 events 頁面且有 categoryId 參數
  const isEventsPage = pathname === "/events";
  const hasCategoryId = searchParams.get("categoryId");
  const showCategoryTitle = isEventsPage && hasCategoryId;

  // 清除分類參數但保留其他參數
  const handleClearCategory = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("categoryId");

    const newUrl = params.toString() ? `/events?${params.toString()}` : "/events";
    router.push(newUrl);
  };

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
    <div
      className="relative w-full"
      ref={containerRef}
    >
      {showCategoryTitle && (
        <div className="text-xl md:text-2xl text-center font-bold font-serif-tc mb-4 lg:mb-6 text-neutral-700">
          {(() => {
            if (isLoading || categories.length === 0) {
              return "類別載入中...";
            }
            const categoryName = categories.find(
              (category) => category.id === Number(hasCategoryId)
            )?.name;
            if (categoryName) {
              return `類別：${categoryName}`;
            }
            return `類別不存在 (ID: ${hasCategoryId})`;
          })()}
        </div>
      )}
      {!isMobile && <SearchInput showBorder={showBorder} />}
      {isMobile && <SearchButton showBorder={showBorder} />}
      {showCategoryTitle && (
        <div className="w-full flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-neutral-400 py-2 cursor-pointer"
            onClick={handleClearCategory}
          >
            <X className="w-4 h-4" />
            清除搜尋類別
          </button>
        </div>
      )}
      <SearchOverlay />
      <MobileSearchOverlay />
    </div>
  );
}

export default function SearchContainer({ showBorder = false }: SearchContainerProps) {
  return (
    <CategoriesProvider>
      <Suspense
        fallback={
          <div className="relative w-full">
            <div className="w-full bg-white rounded-xl px-6 py-3 flex items-center gap-2">
              <div className="flex-1 text-[#525252] text-sm">載入中...</div>
            </div>
          </div>
        }
      >
        <SearchContainerContent showBorder={showBorder} />
      </Suspense>
    </CategoriesProvider>
  );
}
