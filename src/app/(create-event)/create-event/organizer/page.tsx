"use client";

import CreateOrganizerDialog from "@/features/organizer/components/create-organizer-dialog";
import { getApiV1Organizations } from "@/services/api/client/sdk.gen";
import type { OrganizationResponse } from "@/services/api/client/types.gen";
import { useCreateEventStore } from "@/store/create-event";
import { useErrorHandler } from "@/utils/error-handler";
import { cn } from "@/utils/transformer";
import { Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function CreateEventOrganizerPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedOrgName, setSelectedOrgName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const router = useRouter();

  // 錯誤處理
  const { handleError } = useErrorHandler();

  const { organizationInfo, hasUnfinishedEvent, setOrganizationInfo, clearAllData } =
    useCreateEventStore();

  // 載入主辦單位列表
  const loadOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getApiV1Organizations();
      if (response.data?.data) {
        setOrganizations(response.data.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // 初始化時如果有未完成的活動，則清除所有資料並載入主辦單位列表
  useEffect(() => {
    if (hasUnfinishedEvent()) {
      // 重置狀態
      clearAllData();
    }

    // 載入主辦單位列表
    loadOrganizations();
  }, []);

  // 從 store 載入已選擇的主辦單位
  useEffect(() => {
    if (organizationInfo) {
      setSelected(organizationInfo.organizationId);
      setSelectedOrgName(organizationInfo.organizationName);
    }
  }, [organizationInfo]);

  // 選擇主辦單位
  const handleSelectOrganizer = (id: number, name: string) => {
    setSelected(id);
    setSelectedOrgName(name);
  };

  // 處理選擇按鈕點擊 - 只儲存主辦單位資訊，不建立活動
  const handleSelect = () => {
    if (selected && selectedOrgName) {
      // 儲存主辦單位資訊到 store
      setOrganizationInfo({
        organizationId: selected,
        organizationName: selectedOrgName,
      });

      // 導航到活動形式選擇頁面
      router.push("/create-event/new/eventplacetype");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-lg text-gray-600">載入中...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mb-6 w-full">
        <div className="flex flex-col gap-4">
          <CreateOrganizerDialog onSuccess={loadOrganizations} />

          {organizations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              還沒有主辦單位，請先創建一個主辦單位
            </div>
          ) : (
            organizations.map((org) => (
              <button
                key={org.id}
                type="button"
                className={`flex items-center gap-4 bg-white rounded-full px-5 py-3 shadow-sm border transition text-left ${
                  selected === org.id
                    ? "border-primary-500 ring-2 ring-primary-500"
                    : "border-transparent"
                }`}
                onClick={() => org.name && org.id && handleSelectOrganizer(org.id, org.name)}
              >
                <span className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                  {org.avatar ? (
                    <img
                      src={org.avatar}
                      alt={org.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Building className="w-4 h-4 text-gray-400" />
                  )}
                </span>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-lg text-gray-800">{org.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {org.currency && (
                      <span className="text-gray-400 text-sm font-medium">{org.currency}</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button
          type="button"
          className={cn(
            "w-full max-w-xl bg-primary-500 text-neutral-800 text-lg font-bold rounded-full py-3 transition hover:saturate-150 active:scale-95",
            !selected || organizations.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          )}
          disabled={!selected || organizations.length === 0}
          onClick={handleSelect}
        >
          選擇
        </button>
      </div>
    </div>
  );
}
