"use client";

import { useOrganizerStore } from "@/store/organizer";
import { useEffect, useState } from "react";

interface InitOrganizerStateProps {
  orgId: number;
  children: React.ReactNode;
}

export function InitOrganizerState({ orgId, children }: InitOrganizerStateProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const setCurrentOrganizerId = useOrganizerStore((s) => s.setCurrentOrganizerId);
  const fetchCurrentOrganizerInfo = useOrganizerStore((s) => s.fetchCurrentOrganizerInfo);

  useEffect(() => {
    if (isInitialized) return;

    const initializeOrganizer = (state: any) => {
      if (!state.currentId) {
        console.log("設置新的 organizer ID:", orgId);
        setCurrentOrganizerId(orgId);
        fetchCurrentOrganizerInfo();
      }
      setIsInitialized(true);
    };

    // 如果已經 hydrated，立即執行
    if (useOrganizerStore.persist.hasHydrated()) {
      initializeOrganizer(useOrganizerStore.getState());
      return;
    }

    const unsubscribe = useOrganizerStore.persist.onFinishHydration(initializeOrganizer);
    return unsubscribe;
  }, []);

  return <>{children}</>;
}
