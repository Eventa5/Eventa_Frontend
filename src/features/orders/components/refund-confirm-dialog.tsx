"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useState } from "react";
function RefundPolicyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-md border-neutral-400">
        <DialogHeader>
          <DialogTitle>退票處理辦法</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="max-h-72 overflow-y-auto text-sm text-gray-700 space-y-2 p-2">
            <p>1. 退票申請需於活動規定期限內提出，逾期恕不受理。</p>
            <p>2. 票券一經退票即無法恢復，請確認後再申請。</p>
            <p>3. 部分特殊票種（如多人套票）僅接受整筆訂單退票，無法單張退票。</p>
            <p>4. 已使用或已過期票券不得申請退票。</p>
            <p>5. 退票相關問題請洽客服：service@eventa.com</p>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>關閉</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function RefundConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={onCancel}
    >
      <DialogContent className="border-neutral-400">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">委託 Eventa 退票</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-sm text-gray-600 leading-relaxed mb-2">
          我們將會按 Eventa 的退票處理辦法進行退票作業，
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
        <DialogDescription className="text-sm text-gray-600 leading-relaxed mb-2">
          點擊確認後，票券即無法恢復。
        </DialogDescription>

        <DialogDescription className="text-sm text-gray-600 leading-relaxed mb-2">
          僅接受整筆訂單申請退票，無法按票券個別申請退票，例如：多人套票。
        </DialogDescription>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 leading-relaxed cursor-pointer"
          >
            我已閱讀並同意
            <button
              type="button"
              className="underline text-secondary-600 ml-1 hover:text-secondary-800"
              onClick={() => setShowPolicy(true)}
            >
              退票處理辦法
            </button>
          </label>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-neutral-400 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
          >
            取消
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!agreedToTerms}
          >
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
      <RefundPolicyDialog
        open={showPolicy}
        onClose={() => setShowPolicy(false)}
      />
    </Dialog>
  );
}
