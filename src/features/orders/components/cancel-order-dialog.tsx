"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

export default function CancelOrderDialog({ isOpen, onClose, onConfirm }: CancelOrderDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-sm w-[300px] md:w-[350px]">
        <DialogHeader>
          <DialogTitle>確認取消訂單</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            確定要回上一步嗎？
            <br />
            目前的訂單將會被取消
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-md transition"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition disabled:opacity-50"
            onClick={onConfirm}
          >
            確定
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
