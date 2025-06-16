import { getApiV1OrganizationsByOrganizationId } from "@/services/api/client/sdk.gen";
import type { OrganizationResponse } from "@/services/api/client/types.gen";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrganizerState {
  // 當前主辦單位的基本資訊
  currentOrganizerInfo: OrganizationResponse | null;

  // Actions
  setCurrentOrganizer: (id: number, name: string) => void;
  clearCurrentOrganizer: () => void;
  getCurrentOrganizerId: () => number | null;
  getCurrentOrganizerInfo: () => OrganizationResponse | null;
  fetchCurrentOrganizerInfo: () => Promise<OrganizationResponse | null>;
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

      fetchCurrentOrganizerInfo: async () => {
        const currentId = get().getCurrentOrganizerId();
        if (!currentId) return null;

        try {
          const response = await getApiV1OrganizationsByOrganizationId({
            path: {
              organizationId: currentId,
            },
          });

          if (response.data?.data) {
            set({
              currentOrganizerInfo: response.data.data,
            });
            return response.data.data;
          }
          return null;
        } catch (error) {
          console.error("Failed to fetch organizer info:", error);
          return null;
        }
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
