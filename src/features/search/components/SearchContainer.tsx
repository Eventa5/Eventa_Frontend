"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { useSearchStore } from "@/store/search";
import { useEffect, useRef } from "react";
import MobileSearchOverlay from "./MobileSearchOverlay";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";
import SearchOverlay from "./SearchOverlay";

export default function SearchContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useSearchStore((s) => s.setIsSearchOpen);
  const isMobile = useIsMobile();

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
      {!isMobile && <SearchInput />}
      {isMobile && <SearchButton />}
      <SearchOverlay />
      <MobileSearchOverlay />
    </div>
  );
}
