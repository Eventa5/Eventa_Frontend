import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefundSuccessDialog({
  open,
  onClose,
  activityName,
  cancelTime,
}: {
  open: boolean;
  onClose: () => void;
  activityName?: string;
  cancelTime?: string;
}) {
  const router = useRouter();
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="border-neutral-400">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">退票成功</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
          <DialogDescription className="text-center">
            您好，您於{activityName ? `「${activityName}」` : "[活動名稱]"}的票券，已於{" "}
            {cancelTime ?? "[取消活動時間]"} 取消。
            <br />
            有任何問題歡迎前往客服詢問。
          </DialogDescription>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => router.push("/attendee/orders")}>返回訂單管理</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
