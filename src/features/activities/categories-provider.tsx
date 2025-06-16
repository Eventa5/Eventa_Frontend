"use client";

import { useCategoriesStore } from "@/store/categories";
import { useEffect } from "react";

export default function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return <>{children}</>;
}
