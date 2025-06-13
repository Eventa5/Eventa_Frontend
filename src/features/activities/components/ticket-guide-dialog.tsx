"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function TicketGuideDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="border-neutral-400">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">Eventa 取票辦法</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-sm text-gray-600 leading-relaxed mb-2">
          報名成功後至「訂單管理」頁面即可獲取本活動的 QR Code 電子票券憑證，活動當天請出示 QR Code
          完成驗票入場。
        </DialogDescription>
        <DialogDescription className="text-sm text-gray-600 leading-relaxed mb-2">
          有任何問題請洽：
          <Link
            href="mailto:service@eventa.com"
            className="text-secondary-600"
          >
            service@eventa.com
          </Link>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>確定</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
