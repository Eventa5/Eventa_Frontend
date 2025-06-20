import { getApiV1OrganizationsByOrganizationId } from "@/services/api/client/sdk.gen";
import type { OrganizationResponse } from "@/services/api/client/types.gen";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrganizerState {
  // 當前主辦單位的 ID
  currentId: number | null;
  // 當前主辦單位的基本資訊
  currentOrganizerInfo: OrganizationResponse | null;

  // Actions
  setCurrentOrganizerId: (id: number) => void;
  clearCurrentOrganizer: () => void;
  fetchCurrentOrganizerInfo: () => Promise<OrganizationResponse | null>;
}

export const useOrganizerStore = create<OrganizerState>()(
  persist(
    (set, get) => ({
      currentId: null,

      currentOrganizerInfo: null,

      setCurrentOrganizerId: (id: number) => {
        set({
          currentId: id,
        });
      },

      clearCurrentOrganizer: () => {
        set({
          currentId: null,
          currentOrganizerInfo: null,
        });
      },

      fetchCurrentOrganizerInfo: async () => {
        const currentId = get().currentId;
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
        currentId: state.currentId,
        currentOrganizerInfo: state.currentOrganizerInfo,
      }),
    }
  )
);
