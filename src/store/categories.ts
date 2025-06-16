import {
  type FormattedCategory,
  fetchCategories,
  formatCategories,
} from "@/features/activities/categories";
import { create } from "zustand";

interface CategoriesState {
  categories: FormattedCategory[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const categories = await fetchCategories();
      const formattedCategories = formatCategories(categories);
      set({ categories: formattedCategories, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "無法獲取類別資料",
        isLoading: false,
      });
    }
  },
}));
