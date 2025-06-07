"use client";

import { useOrganizerStore } from "@/store/organizer";
import { useEffect } from "react";

interface InitOrganizerStateProps {
  orgId: number;
  orgName: string;
  children: React.ReactNode;
}

export function InitOrganizerState({ orgId, orgName, children }: InitOrganizerStateProps) {
  const currentOrganizerInfo = useOrganizerStore((state) => state.currentOrganizerInfo);
  const setCurrentOrganizer = useOrganizerStore((state) => state.setCurrentOrganizer);

  useEffect(() => {
    if (!currentOrganizerInfo) {
      setCurrentOrganizer(orgId, orgName);
    }
  }, [currentOrganizerInfo, orgId, orgName, setCurrentOrganizer]);

  return <>{children}</>;
}
