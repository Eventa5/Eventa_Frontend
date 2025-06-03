import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RefundFailDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="border-neutral-400">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">退票失敗，請重新操作</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          退票失敗可能因為已申請過、超過期限、已使用或不符規則。
        </DialogDescription>
        <div className="py-2 text-muted-foreground text-sm">
          退票失敗原因可能有：
          <ul className="list-disc pl-5 mt-2">
            <li>已申請過退票</li>
            <li>超出退票申請期限</li>
            <li>票券已使用</li>
            <li>不符合多人票張數限制</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
