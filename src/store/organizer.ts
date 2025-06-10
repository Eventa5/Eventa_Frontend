import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrganizerState {
  // 當前主辦單位的基本資訊
  currentOrganizerInfo: {
    id: number;
    name: string;
  } | null;

  // Actions
  setCurrentOrganizer: (id: number, name: string) => void;
  clearCurrentOrganizer: () => void;
  getCurrentOrganizerId: () => number | null;
  getCurrentOrganizerInfo: () => { id: number; name: string } | null;
}

export const useOrganizerStore = create<OrganizerState>()(
  persist(
    (set, get) => ({
      currentOrganizerInfo: null,

      setCurrentOrganizer: (id: number, name: string) => {
        set({
          currentOrganizerInfo: { id, name },
        });
      },

      clearCurrentOrganizer: () => {
        set({
          currentOrganizerInfo: null,
        });
      },

      getCurrentOrganizerId: () => {
        return get().currentOrganizerInfo?.id ?? null;
      },

      getCurrentOrganizerInfo: () => {
        return get().currentOrganizerInfo;
      },
    }),
    {
      name: "organizer-store", // localStorage key
      partialize: (state) => ({
        currentOrganizerInfo: state.currentOrganizerInfo,
      }),
    }
  )
);
