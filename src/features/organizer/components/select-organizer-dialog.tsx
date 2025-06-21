"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteApiV1Organizations, getApiV1Organizations } from "@/services/api/client/sdk.gen";
import type { OrganizationResponse } from "@/services/api/client/types.gen";
import { useOrganizerStore } from "@/store/organizer";
import { useErrorHandler } from "@/utils/error-handler";
import { cn } from "@/utils/transformer";
import { Building, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface SelectOrganizerDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

// 確認刪除彈窗組件
interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  organizationName: string;
  isDeleting: boolean;
}

function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  organizationName,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-sm w-[300px] md:w-[350px]">
        <DialogHeader>
          <DialogTitle>確認刪除主辦單位</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-4">
            確定要刪除主辦單位「
            <span className="font-medium text-gray-800">{organizationName}</span>
            」嗎？
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
            onClick={onClose}
            disabled={isDeleting}
          >
            取消
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition disabled:opacity-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "刪除中..." : "確認刪除"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SelectOrganizerDialog({ children, onSuccess }: SelectOrganizerDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<OrganizationResponse | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // 錯誤處理
  const { handleError } = useErrorHandler();

  // organizer store
  const currentId = useOrganizerStore((s) => s.currentId);
  const setCurrentOrganizerId = useOrganizerStore((s) => s.setCurrentOrganizerId);
  const fetchCurrentOrganizerInfo = useOrganizerStore((s) => s.fetchCurrentOrganizerInfo);

  // 載入主辦單位列表
  const loadOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getApiV1Organizations();
      if (response.error) {
        throw new Error(response.error.message || "載入主辦單位失敗");
      }

      if (response.data?.data) {
        setOrganizations(response.data.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // 當彈窗打開時載入主辦單位列表
  useEffect(() => {
    if (open) {
      loadOrganizations();
    }
  }, [open, loadOrganizations]);

  // 當組織列表載入完成後，設定當前選中的主辦單位
  useEffect(() => {
    if (open && organizations.length > 0) {
      if (currentId) {
        setSelected(currentId);
      }
    }
  }, [open, organizations, currentId]);

  // 選擇主辦單位
  const handleSelectOrganizer = (id: number) => {
    setSelected(id);
  };

  // 處理選擇按鈕點擊
  const handleSelect = async () => {
    if (selected) {
      // 儲存主辦單位資訊到 organizer store
      setCurrentOrganizerId(selected);
      await fetchCurrentOrganizerInfo();

      // 關閉彈窗
      setOpen(false);

      // 重置狀態
      setSelected(null);

      // 呼叫成功回調
      onSuccess?.();
    }
  };

  // 處理建立新主辦單位
  const handleCreateOrganizer = () => {
    setOpen(false);
    router.push("/create");
  };

  // 處理刪除按鈕點擊
  const handleDeleteClick = (org: OrganizationResponse, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發選擇事件
    setOrganizationToDelete(org);
    setDeleteConfirmOpen(true);
  };

  // 確認刪除
  const handleConfirmDelete = async () => {
    if (!organizationToDelete?.id) return;

    try {
      setIsDeleting(true);
      const response = await deleteApiV1Organizations({
        body: {
          id: organizationToDelete.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "刪除主辦單位失敗");
      }

      // 刪除成功，重新載入組織列表
      await loadOrganizations();

      // 如果刪除的是當前選中的組織，清除選中狀態
      if (selected === organizationToDelete.id) {
        setSelected(null);
      }

      // 關閉確認彈窗
      setDeleteConfirmOpen(false);
      setOrganizationToDelete(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 取消刪除
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setOrganizationToDelete(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // 關閉彈窗時重置狀態
      setSelected(null);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>切換主辦中心</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* 建立主辦單位選項 */}
            <button
              type="button"
              className="flex items-center gap-3 bg-primary-50 rounded-lg px-4 py-3 border border-primary-200 hover:bg-primary-100 transition text-left"
              onClick={handleCreateOrganizer}
            >
              <span className="bg-primary-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-neutral-800" />
              </span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-base text-gray-800">建立新的主辦單位</span>
              </div>
            </button>

            {/* 分隔線 */}
            <div className="border-t border-gray-200" />
          </div>

          <div className="flex-1 px-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-lg text-gray-600">載入中...</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {organizations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    還沒有主辦單位，請先創建一個主辦單位
                  </div>
                ) : (
                  organizations.map((org) => (
                    <div
                      key={org.id}
                      className={`flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border-2 transition ${
                        selected === org.id
                          ? "border-primary-400 hover:border-primary-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <button
                        type="button"
                        className="flex items-center gap-3 flex-1 text-left"
                        onClick={() => {
                          org.id && handleSelectOrganizer(org.id);
                        }}
                      >
                        <span className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
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
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-base text-gray-800 truncate">
                            {org.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {org.currency && (
                              <span className="text-gray-400 text-sm font-medium">
                                {org.currency}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>

                      {/* 刪除按鈕 - 只有不是當前組織時才顯示 */}
                      {currentId !== org.id && (
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition flex-shrink-0"
                          onClick={(e) => handleDeleteClick(org, e)}
                          title="刪除主辦單位"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {organizations.length > 0 && (
            <div className="pt-4 mt-4">
              <button
                type="button"
                className={cn(
                  "w-full bg-primary-500 text-neutral-800 text-base font-bold rounded-lg py-3 transition hover:saturate-150 active:scale-95",
                  !selected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                )}
                disabled={!selected}
                onClick={handleSelect}
              >
                選擇
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 確認刪除彈窗 */}
      <ConfirmDeleteDialog
        isOpen={deleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        organizationName={organizationToDelete?.name || ""}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default SelectOrganizerDialog;
