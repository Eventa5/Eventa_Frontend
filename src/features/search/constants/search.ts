// 熱門搜尋關鍵詞類型
export interface PopularSearchItem {
  term: string;
  bgColor: string;
  hoverColor?: string;
}

// 分類項目類型
export interface CategoryItem {
  id: string;
  name: string;
  imagePath: string;
}

// 熱門搜尋關鍵詞
export const POPULAR_SEARCHES: PopularSearchItem[] = [
  { term: "戶外電影院", bgColor: "bg-[#E5E5E5]", hoverColor: "hover:bg-gray-300" },
  { term: "春日野餐季", bgColor: "bg-[#FFE6A6]", hoverColor: "hover:bg-[#ffd452]" },
  { term: "時尚前線", bgColor: "bg-[#E5E5E5]", hoverColor: "hover:bg-gray-300" },
  { term: "沙灘音樂節", bgColor: "bg-[#E5E5E5]", hoverColor: "hover:bg-gray-300" },
];

// 分類項目
export const CATEGORIES: CategoryItem[] = [
  { id: "精選", name: "精選活動", imagePath: "/images/category-featured.jpg" },
  { id: "學習", name: "學習活動", imagePath: "/images/category-learning.jpg" },
  { id: "藝文", name: "藝文活動", imagePath: "/images/category-arts.jpg" },
  { id: "體驗", name: "體驗活動", imagePath: "/images/category-experience.jpg" },
  { id: "AI推薦", name: "AI 為您推薦", imagePath: "/images/category-ai.jpg" },
];
