import { create } from "zustand";

interface SearchState {
  isSearchOpen: boolean;
  searchValue: string;
  setIsSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchValue: (value: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isSearchOpen: false,
  searchValue: "",
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchValue: (value) => set({ searchValue: value }),
}));
