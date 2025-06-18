"use client";

import { useSearchStore } from "@/store/search";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface SearchButtonProps {
  showBorder?: boolean;
}

export default function SearchButton({ showBorder = false }: SearchButtonProps) {
  const toggleSearch = useSearchStore((s) => s.toggleSearch);
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("search");

  return (
    <button
      type="button"
      onClick={toggleSearch}
      className={`w-full bg-white rounded-xl px-6 py-3 flex items-center justify-center gap-2 cursor-pointe ${
        showBorder ? "rounded-xl border border-primary-500 border-2" : ""
      }`}
      aria-label="開啟搜尋"
    >
      <Search
        size={20}
        className="text-[#525252]"
      />
      <span className="text-left text-[#525252] text-sm">{searchKeyword ?? "找活動"}</span>
    </button>
  );
}
