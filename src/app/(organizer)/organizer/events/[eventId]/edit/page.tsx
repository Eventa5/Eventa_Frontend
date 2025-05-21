import { redirect } from "next/navigation";

export default function EditEventPage() {
  // 將用戶重定向到基本資訊頁面
  redirect("./edit/basicinfo");
}
