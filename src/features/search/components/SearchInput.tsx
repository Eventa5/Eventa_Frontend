"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { useSearchStore } from "@/store/search";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className = "" }: SearchInputProps) {
  const searchValue = useSearchStore((s) => s.searchValue);
  const setSearchValue = useSearchStore((s) => s.setSearchValue);
  const isSearchOpen = useSearchStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useSearchStore((s) => s.setIsSearchOpen);
  const toggleSearch = useSearchStore((s) => s.toggleSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isMobile = useIsMobile();

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
      router.push(`/events?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="w-full bg-white rounded-xl px-6 py-3 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="輸入關鍵字搜尋..."
          className="flex-1 outline-none text-[#525252] text-sm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
