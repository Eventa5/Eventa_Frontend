"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/dialog";
import { cn } from "@/utils/transformer";
import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

export default function ErrorDialog() {
  const { errorDialogOpen, errorMessage, hideError } = useDialogStore();

  // 自動關閉計時器
  useEffect(() => {
    if (errorDialogOpen) {
      const timer = setTimeout(() => {
        hideError();
      }, 5000); // 5秒後自動關閉

      return () => clearTimeout(timer);
    }
  }, [errorDialogOpen, hideError]);

  return (
    <Dialog
      open={errorDialogOpen}
      onOpenChange={(open) => !open && hideError()}
    >
      <DialogContent className="max-w-md border-[#FFE6A6] shadow-lg w-[calc(100%-2rem)] p-4 sm:p-6">
        <DialogHeader className="pb-2 text-left">
          <DialogTitle className="flex items-center gap-2 text-neutral-800 font-bold text-base sm:text-lg">
            <div className="bg-[#FFF7E1] p-1.5 sm:p-2 rounded-full">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-[#F07348]" />
            </div>
            錯誤提示
          </DialogTitle>
        </DialogHeader>

        <div className="py-3 sm:py-4">
          <p className="text-neutral-700 text-sm sm:text-base break-words">{errorMessage}</p>
        </div>

        <DialogFooter className="sm:justify-end justify-center mt-2">
          <Button
            onClick={hideError}
            className={cn(
              "bg-[#FFD56B] hover:bg-[#FFCA28] text-[#262626]",
              "px-6 py-2 h-auto font-normal transition-colors w-full sm:w-auto"
            )}
          >
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
