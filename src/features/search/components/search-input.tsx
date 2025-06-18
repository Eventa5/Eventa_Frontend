"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { useSearchStore } from "@/store/search";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

interface SearchInputProps {
  className?: string;
  showBorder?: boolean;
}

export default function SearchInput({ className = "", showBorder = false }: SearchInputProps) {
  const searchValue = useSearchStore((s) => s.searchValue);
  const setSearchValue = useSearchStore((s) => s.setSearchValue);
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useSearchStore((s) => s.setIsSearchOpen);
  const toggleSearch = useSearchStore((s) => s.toggleSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim() === "") {
      // 如果輸入框被清空，移除 search 參數
      params.delete("search");
    } else {
      // 如果有值，設置 search 參數
      params.set("search", value.trim());
    }

    const newUrl = params.toString() ? `/events?${params.toString()}` : "/events";
    router.replace(newUrl, { scroll: false });
  };

  // 處理輸入框獲得焦點
  const handleFocus = () => {
    if (!isMobile) {
      setIsSearchOpen(true);
    }
  };

  // 點擊搜尋圖標
  const handleSearchIconClick = () => {
    if (!isMobile) {
      toggleSearch();
      if (!isSearchOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // 處理按下 Enter 鍵
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      setIsSearchOpen(false);
      const params = new URLSearchParams(searchParams);
      params.set("search", searchValue.trim());
      router.push(`/events?${params.toString()}`);
    }
  };

  return (
    <div
      className={`relative w-full max-w-[900px] ${className} ${
        showBorder ? "rounded-xl border border-primary-500 border-2" : ""
      }`}
    >
      <div className="w-full bg-white rounded-xl px-6 py-3 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="輸入關鍵字搜尋..."
          className="flex-1 outline-none text-[#525252] text-sm"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        <div
          className="cursor-pointer"
          onClick={handleSearchIconClick}
        >
          <Search
            size={20}
            className="text-[#525252]"
          />
        </div>
      </div>
    </div>
  );
}
